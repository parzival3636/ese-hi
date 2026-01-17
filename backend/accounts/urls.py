from django.urls import path
from . import views

print("Loading accounts URLs...")
print(f"Available views: {dir(views)}")

urlpatterns = [
    path('register/developer/', views.register_developer, name='register_developer'),
    path('register/company/', views.register_company, name='register_company'),
    path('login/', views.login, name='login'),
    path('profile/', views.get_user_profile, name='get_user_profile'),
    path('projects/', views.get_projects, name='get_projects'),
    path('company/projects/', views.get_company_projects, name='get_company_projects'),
    path('company/projects/create/', views.create_project, name='create_project'),
    path('company/projects/<int:project_id>/edit/', views.edit_project, name='edit_project'),
    path('company/projects/<int:project_id>/applications/', views.get_project_applications, name='get_project_applications'),
    path('projects/<int:project_id>/apply/', views.apply_to_project, name='apply_to_project'),
    path('developers/', views.get_developers, name='get_developers'),
    path('test/', views.test_endpoint, name='test_endpoint'),
]

print(f"URL patterns loaded: {[pattern.pattern._route for pattern in urlpatterns]}")