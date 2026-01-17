from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import uuid
from datetime import datetime
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
                "password": data['password']
            })
            
            if auth_response.user:
                user_id = auth_response.user.id
                
                # Create user profile in custom table
                user_data = {
                    'username': data['email'],  # Use email as username
                    'email': data['email'],
                    'password': 'supabase_auth',  # Placeholder since Supabase handles auth
                    'first_name': data['firstName'],
                    'last_name': data['lastName'],
                    'phone': data.get('phone', ''),
                    'country': data['country'],
                    'city': data.get('city', ''),
                    'user_type': 'developer',
                    'is_verified': False
                }
                
                user_result = supabase.table('accounts_user').insert(user_data).execute()
                db_user_id = user_result.data[0]['id']  # Get auto-generated ID
                
                # TODO: Create developer profile when table exists
                # supabase.table('accounts_developerprofile').insert(profile_data).execute()
                
                return JsonResponse({
                    'message': 'Developer registered successfully',
                    'user_id': db_user_id,
                    'supabase_user_id': user_id
                })
            else:
                return JsonResponse({'error': 'Registration failed'}, status=400)
            
        except Exception as e:
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
                "password": data['password']
            })
            
            if auth_response.user:
                user_id = auth_response.user.id
                
                # Create user profile in custom table
                user_data = {
                    'username': data['email'],  # Use email as username
                    'email': data['email'],
                    'password': 'supabase_auth',  # Placeholder since Supabase handles auth
                    'first_name': data['companyName'],
                    'last_name': '',
                    'phone': data.get('phone', ''),
                    'country': data['country'],
                    'city': data.get('city', ''),
                    'user_type': 'company',
                    'is_verified': False
                }
                
                user_result = supabase.table('accounts_user').insert(user_data).execute()
                db_user_id = user_result.data[0]['id']  # Get auto-generated ID
                
                # Create company profile
                profile_data = {
                    'user_id': db_user_id,
                    'company_name': data['companyName'],
                    'company_size': data['companySize'],
                    'industry': data['industry'],
                    'website': data.get('website', ''),
                    'description': data['description'],
                    'founded_year': int(data['foundedYear']) if data.get('foundedYear') else None,
                    'company_type': data.get('companyType', 'startup')
                }
                
                supabase.table('accounts_companyprofile').insert(profile_data).execute()
                
                return JsonResponse({
                    'message': 'Company registered successfully',
                    'user_id': db_user_id,
                    'supabase_user_id': user_id
                })
            else:
                return JsonResponse({'error': 'Registration failed'}, status=400)
            
        except Exception as e:
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
            
            # Use Supabase Auth to sign in
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if auth_response.user:
                user_id = auth_response.user.id
                
                # Get user profile from custom table by email and user_type
                user_result = supabase.table('accounts_user').select('*').eq('email', email).eq('user_type', user_type).execute()
                
                if not user_result.data:
                    return JsonResponse({'error': 'Invalid user type'}, status=401)
                
                user = user_result.data[0]
                
                return JsonResponse({
                    'message': 'Login successful',
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'first_name': user['first_name'],
                        'last_name': user['last_name'],
                        'user_type': user['user_type']
                    },
                    'session': {
                        'access_token': auth_response.session.access_token,
                        'refresh_token': auth_response.session.refresh_token
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
            
        except Exception as e:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def logout(request):
    return JsonResponse({'message': 'Logout endpoint'})

def profile(request):
    return JsonResponse({'message': 'Profile endpoint'})