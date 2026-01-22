from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models
from datetime import timedelta
import json

from projects.models import (
    Project, ProjectApplication, ProjectAssignment,
    ProjectChat, ChatMessage, FigmaDesignSubmission, ProjectSubmission
)
from projects.assignment_serializers import (
    ProjectAssignmentSerializer, ChatMessageSerializer,
    FigmaDesignSubmissionSerializer, ProjectSubmissionSerializer
)


class ProjectAssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing project assignments"""
    queryset = ProjectAssignment.objects.all()
    serializer_class = ProjectAssignmentSerializer
    permission_classes = []
    
    @action(detail=False, methods=['post'])
    def assign_project(self, request):
        """Assign a project to a developer from an application"""
        application_id = request.data.get('application_id')
        
        try:
            application = ProjectApplication.objects.get(id=application_id)
            project = application.project
            
            # Check if already assigned
            if ProjectAssignment.objects.filter(project=project).exists():
                return Response(
                    {'error': 'Project already assigned'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create assignment
            assignment = ProjectAssignment.objects.create(
                project=project,
                developer=application.developer,
                application=application
            )
            
            # Create chat
            chat = ProjectChat.objects.create(assignment=assignment)
            
            # Create congratulations message - use project company as sender
            ChatMessage.objects.create(
                chat=chat,
                sender=project.company,
                message=f"Congratulations! You have been selected for the project '{project.title}'. "
                        f"Please submit your Figma designs within 1 week and the final project within 30 days.",
                message_type='system'
            )
            
            # Update application status
            application.status = 'selected'
            application.save()
            
            # Update project status
            project.status = 'in_progress'
            project.save()
            
            serializer = self.get_serializer(assignment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ProjectApplication.DoesNotExist:
            return Response(
                {'error': 'Application not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def chat(self, request, pk=None):
        """Get chat for an assignment"""
        assignment = self.get_object()
        
        # Verify user is part of this assignment
        if request.user != assignment.project.company and request.user != assignment.developer:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            chat = assignment.chat
            serializer = ChatMessageSerializer(chat.messages.all(), many=True)
            return Response({'messages': serializer.data})
        except ProjectChat.DoesNotExist:
            return Response(
                {'error': 'Chat not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in the chat"""
        assignment = self.get_object()
        
        # Verify user is part of this assignment
        if request.user != assignment.project.company and request.user != assignment.developer:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            chat = assignment.chat
            message_text = request.data.get('message', '')
            attachments = request.data.get('attachments', [])
            
            message = ChatMessage.objects.create(
                chat=chat,
                sender=request.user,
                message=message_text,
                attachments=attachments,
                message_type='text'
            )
            
            serializer = ChatMessageSerializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ProjectChat.DoesNotExist:
            return Response(
                {'error': 'Chat not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def submit_figma(self, request, pk=None):
        """Submit Figma designs"""
        assignment = self.get_object()
        
        # Verify user is the developer
        if request.user != assignment.developer:
            return Response(
                {'error': 'Only the assigned developer can submit'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check deadline
        if timezone.now() > assignment.figma_deadline:
            return Response(
                {'error': 'Figma submission deadline has passed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            figma_url = request.data.get('figma_url')
            description = request.data.get('description', '')
            
            # Create submission
            submission = FigmaDesignSubmission.objects.create(
                assignment=assignment,
                developer=request.user,
                figma_url=figma_url,
                description=description
            )
            
            # Update assignment
            assignment.figma_submitted = True
            assignment.save()
            
            # Send system message
            chat = assignment.chat
            ChatMessage.objects.create(
                chat=chat,
                sender=request.user,
                message=f"Figma designs submitted! URL: {figma_url}",
                message_type='system'
            )
            
            serializer = FigmaDesignSubmissionSerializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def submit_project(self, request, pk=None):
        """Submit final project"""
        assignment = self.get_object()
        
        # Verify user is the developer
        if request.user != assignment.developer:
            return Response(
                {'error': 'Only the assigned developer can submit'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check deadline
        if timezone.now() > assignment.submission_deadline:
            return Response(
                {'error': 'Project submission deadline has passed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            description = request.data.get('description', '')
            documentation_links = request.data.get('documentation_links', [])
            github_links = request.data.get('github_links', [])
            project_links = request.data.get('project_links', [])
            additional_links = request.data.get('additional_links', [])
            
            # Create submission
            submission = ProjectSubmission.objects.create(
                assignment=assignment,
                developer=request.user,
                description=description,
                documentation_links=documentation_links,
                github_links=github_links,
                project_links=project_links,
                additional_links=additional_links
            )
            
            # Update assignment
            assignment.project_submitted = True
            assignment.save()
            
            # Send system message
            chat = assignment.chat
            ChatMessage.objects.create(
                chat=chat,
                sender=request.user,
                message="Project submitted for review!",
                message_type='system'
            )
            
            serializer = ProjectSubmissionSerializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def review_submission(self, request, pk=None):
        """Company reviews project submission"""
        assignment = self.get_object()
        
        # Verify user is the company
        if request.user != assignment.project.company:
            return Response(
                {'error': 'Only the company can review submissions'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            submission = assignment.submission
            approved = request.data.get('approved')
            feedback = request.data.get('feedback', '')
            
            # Update submission
            submission.approved = approved
            submission.company_feedback = feedback
            submission.reviewed_at = timezone.now()
            submission.save()
            
            # Update project status
            if approved:
                assignment.project.status = 'completed'
            else:
                assignment.project.status = 'review'
            assignment.project.save()
            
            # Send system message
            chat = assignment.chat
            status_text = "approved" if approved else "needs revisions"
            ChatMessage.objects.create(
                chat=chat,
                sender=request.user,
                message=f"Project {status_text}. Feedback: {feedback}",
                message_type='system'
            )
            
            serializer = ProjectSubmissionSerializer(submission)
            return Response(serializer.data)
            
        except ProjectSubmission.DoesNotExist:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def developer_assignments(self, request):
        """Get all assignments for a developer"""
        # Get developer ID from query params or session
        developer_id = request.query_params.get('developer_id')
        
        if not developer_id and request.user and request.user.id:
            developer_id = request.user.id
        
        if not developer_id:
            return Response({'error': 'Developer ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            developer = User.objects.get(id=developer_id)
            assignments = ProjectAssignment.objects.filter(developer=developer)
            serializer = self.get_serializer(assignments, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'Developer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def company_assignments(self, request):
        """Get all assignments for a company"""
        # Get company ID from query params or session
        company_id = request.query_params.get('company_id')
        
        if not company_id and request.user and request.user.id:
            company_id = request.user.id
        
        if not company_id:
            return Response({'error': 'Company ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            company = User.objects.get(id=company_id)
            assignments = ProjectAssignment.objects.filter(project__company=company)
            serializer = self.get_serializer(assignments, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
