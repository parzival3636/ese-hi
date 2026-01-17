from django.urls import path
from . import views

urlpatterns = [
    path('register/developer/', views.register_developer, name='register_developer'),
    path('register/company/', views.register_company, name='register_company'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
]