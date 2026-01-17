from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .supabase_client import get_supabase_client

@csrf_exempt
def register_developer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            supabase = get_supabase_client()
            
            # Use Supabase Auth to create user
            auth_response = supabase.auth.sign_up({
                "email": data['email'],
                "password": data['password'],
                "options": {
                    "data": {
                        "first_name": data['firstName'],
                        "last_name": data['lastName'],
                        "user_type": "developer",
                        "phone": data.get('phone', ''),
                        "country": data['country'],
                        "city": data.get('city', '')
                    }
                }
            })
            
            if auth_response.user:
                return JsonResponse({
                    'message': 'Developer registered successfully',
                    'user': {
                        'id': auth_response.user.id,
                        'email': auth_response.user.email,
                        'first_name': data['firstName'],
                        'last_name': data['lastName'],
                        'user_type': 'developer'
                    },
                    'session': {
                        'access_token': auth_response.session.access_token if auth_response.session else None,
                        'refresh_token': auth_response.session.refresh_token if auth_response.session else None
                    }
                })
            else:
                return JsonResponse({'error': 'Registration failed'}, status=400)
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def register_company(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            supabase = get_supabase_client()
            
            # Use Supabase Auth to create user
            auth_response = supabase.auth.sign_up({
                "email": data['email'],
                "password": data['password'],
                "options": {
                    "data": {
                        "first_name": data['companyName'],
                        "last_name": "",
                        "user_type": "company",
                        "phone": data.get('phone', ''),
                        "country": data['country'],
                        "city": data.get('city', '')
                    }
                }
            })
            
            if auth_response.user:
                return JsonResponse({
                    'message': 'Company registered successfully',
                    'user': {
                        'id': auth_response.user.id,
                        'email': auth_response.user.email,
                        'first_name': data['companyName'],
                        'last_name': '',
                        'user_type': 'company'
                    },
                    'session': {
                        'access_token': auth_response.session.access_token if auth_response.session else None,
                        'refresh_token': auth_response.session.refresh_token if auth_response.session else None
                    }
                })
            else:
                return JsonResponse({'error': 'Registration failed'}, status=400)
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data['email']
            password = data['password']
            user_type = data['userType']
            
            supabase = get_supabase_client()
            
            # Use Supabase Auth to sign in with email confirmation bypass
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            # If user exists but email not confirmed, try to confirm it automatically
            if not auth_response.user and "Email not confirmed" in str(auth_response):
                try:
                    # Get user by email and confirm
                    admin_response = supabase.auth.admin.get_user_by_email(email)
                    if admin_response.user:
                        # Confirm the user
                        supabase.auth.admin.update_user_by_id(
                            admin_response.user.id,
                            {"email_confirm": True}
                        )
                        # Try login again
                        auth_response = supabase.auth.sign_in_with_password({
                            "email": email,
                            "password": password
                        })
                except Exception as e:
                    print(f"Auto-confirm failed: {str(e)}")
            
            if auth_response.user:
                user_metadata = auth_response.user.user_metadata or {}
                
                # Check if user type matches
                if user_metadata.get('user_type') != user_type:
                    return JsonResponse({'error': 'Invalid user type'}, status=401)
                
                return JsonResponse({
                    'message': 'Login successful',
                    'user': {
                        'id': auth_response.user.id,
                        'email': auth_response.user.email,
                        'first_name': user_metadata.get('first_name', ''),
                        'last_name': user_metadata.get('last_name', ''),
                        'user_type': user_metadata.get('user_type', '')
                    },
                    'session': {
                        'access_token': auth_response.session.access_token,
                        'refresh_token': auth_response.session.refresh_token
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
            
        except Exception as e:
            print(f"Login error: {str(e)}")
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_user_profile(request):
    if request.method == 'GET':
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({'error': 'No authorization token'}, status=401)
            
            token = auth_header.replace('Bearer ', '')
            supabase = get_supabase_client()
            
            # Verify token and get user
            user_response = supabase.auth.get_user(token)
            if user_response.user:
                user_metadata = user_response.user.user_metadata or {}
                
                return JsonResponse({
                    'user': {
                        'id': user_response.user.id,
                        'email': user_response.user.email,
                        'first_name': user_metadata.get('first_name', ''),
                        'last_name': user_metadata.get('last_name', ''),
                        'user_type': user_metadata.get('user_type', '')
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid token'}, status=401)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=401)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_projects(request):
    if request.method == 'GET':
        # Mock data for now
        projects = [
            {
                'id': 1,
                'title': 'E-commerce Website Development',
                'description': 'Build a modern e-commerce platform with React and Node.js',
                'budget': '$2000-$5000',
                'skills': ['React', 'Node.js', 'MongoDB'],
                'posted_date': '2 days ago',
                'company': 'TechCorp Inc.'
            },
            {
                'id': 2,
                'title': 'Mobile App UI/UX Design',
                'description': 'Design user interface for a fitness tracking mobile application',
                'budget': '$1500-$3000',
                'skills': ['UI/UX', 'Figma', 'Mobile Design'],
                'posted_date': '1 week ago',
                'company': 'FitLife Solutions'
            }
        ]
        return JsonResponse({'projects': projects})
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_company_projects(request):
    if request.method == 'GET':
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({'error': 'No authorization token'}, status=401)
            
            token = auth_header.replace('Bearer ', '')
            supabase = get_supabase_client()
            
            # Verify token and get user
            user_response = supabase.auth.get_user(token)
            if not user_response.user:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            # Get all projects for now (since we don't have company_id relationship)
            projects_result = supabase.table('projects_project').select('*').execute()
            
            return JsonResponse({'projects': projects_result.data})
            
        except Exception as e:
            print(f"Get projects error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def edit_project(request, project_id):
    if request.method == 'GET':
        try:
            supabase = get_supabase_client()
            result = supabase.table('projects_project').select('*').eq('id', project_id).execute()
            
            if result.data:
                return JsonResponse({'project': result.data[0]})
            return JsonResponse({'error': 'Project not found'}, status=404)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            supabase = get_supabase_client()
            
            # Map form data like in create_project
            category_map = {
                'web-development': 'web',
                'mobile-development': 'mobile',
                'ui-ux-design': 'design',
                'backend-development': 'backend',
                'frontend-development': 'frontend',
                'full-stack-development': 'fullstack'
            }
            
            complexity_map = {
                'entry': 'simple',
                'intermediate': 'medium', 
                'expert': 'complex'
            }
            
            budget_amount = int(data['budget']) if data['budget'].isdigit() else 1000
            
            update_data = {
                'title': data['title'],
                'description': data['description'],
                'category': category_map.get(data['category'], 'other'),
                'complexity': complexity_map.get(data['experience'], 'simple'),
                'budget_min': budget_amount,
                'budget_max': budget_amount * 1.5,
                'estimated_duration': f"{data['timeline']} weeks",
                'tech_stack': data['skills'].split(),
                'updated_at': 'NOW()'
            }
            
            result = supabase.table('projects_project').update(update_data).eq('id', project_id).execute()
            
            return JsonResponse({'message': 'Project updated successfully', 'project': result.data[0] if result.data else update_data})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def apply_to_project(request, project_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({'error': 'No authorization token'}, status=401)
            
            token = auth_header.replace('Bearer ', '')
            supabase = get_supabase_client()
            
            user_response = supabase.auth.get_user(token)
            if not user_response.user:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            # Calculate ML matching score (placeholder for now)
            matching_score = 85.5  # Will be replaced with actual ML model
            
            application_data = {
                'project_id': project_id,
                'developer_email': user_response.user.email,
                'cover_letter': data.get('coverLetter', ''),
                'proposed_budget': int(data.get('proposedBudget', 0)),
                'estimated_timeline': data.get('timeline', ''),
                'matching_score': matching_score,
                'status': 'pending'
            }
            
            result = supabase.table('applications').insert(application_data).execute()
            
            return JsonResponse({'message': 'Application submitted successfully', 'application': result.data[0] if result.data else application_data})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_project_applications(request, project_id):
    if request.method == 'GET':
        try:
            supabase = get_supabase_client()
            
            # Get applications sorted by matching_score (highest first)
            result = supabase.table('applications').select('*').eq('project_id', project_id).order('matching_score', desc=True).execute()
            
            return JsonResponse({'applications': result.data})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_developers(request):
    if request.method == 'GET':
        try:
            supabase = get_supabase_client()
            
            # Get all developer users from Supabase Auth
            # For now, return mock data since we're using Auth metadata
            mock_developers = [
                {
                    'id': 1,
                    'name': 'John Doe',
                    'email': 'john@example.com',
                    'title': 'Full Stack Developer',
                    'skills': ['React', 'Node.js', 'Python'],
                    'experience': '3 years',
                    'rating': 4.8,
                    'hourly_rate': 50,
                    'location': 'New York, USA'
                },
                {
                    'id': 2,
                    'name': 'Jane Smith',
                    'email': 'jane@example.com',
                    'title': 'UI/UX Designer',
                    'skills': ['Figma', 'Adobe XD', 'React'],
                    'experience': '5 years',
                    'rating': 4.9,
                    'hourly_rate': 60,
                    'location': 'London, UK'
                }
            ]
            
            return JsonResponse({'developers': mock_developers})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def test_endpoint(request):
    return JsonResponse({'message': 'Test endpoint working', 'method': request.method})

@csrf_exempt
def create_project(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({'error': 'No authorization token'}, status=401)
            
            token = auth_header.replace('Bearer ', '')
            supabase = get_supabase_client()
            
            # Verify token and get user
            user_response = supabase.auth.get_user(token)
            if not user_response.user:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            # Map categories to match database constraints
            category_map = {
                'web-development': 'web',
                'mobile-development': 'mobile',
                'ui-ux-design': 'design',
                'backend-development': 'backend',
                'frontend-development': 'frontend',
                'full-stack-development': 'fullstack'
            }
            
            # Map complexity levels
            complexity_map = {
                'entry': 'simple',
                'intermediate': 'medium', 
                'expert': 'complex'
            }
            
            budget_amount = int(data['budget']) if data['budget'].isdigit() else 1000
            
            project_data = {
                'title': data['title'],
                'description': data['description'],
                'category': category_map.get(data['category'], 'other'),
                'complexity': complexity_map.get(data['experience'], 'simple'),
                'budget_min': budget_amount,
                'budget_max': budget_amount * 1.5,
                'estimated_duration': f"{data['timeline']} weeks",
                'tech_stack': data['skills'].split(),
                'status': 'open',
                'start_date': '2026-01-18',
                'deadline': '2026-02-18'
            }
            
            result = supabase.table('projects_project').insert(project_data).execute()
            
            return JsonResponse({
                'message': 'Project created successfully',
                'project': result.data[0] if result.data else project_data
            })
            
        except Exception as e:
            print(f"Create project error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)