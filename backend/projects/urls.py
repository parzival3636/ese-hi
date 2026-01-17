from django.urls import path
from . import views

urlpatterns = [
    path('', views.project_list, name='project-list'),
    path('create/', views.project_create, name='project-create'),
    path('<int:pk>/', views.project_detail, name='project-detail'),
    path('<int:pk>/apply/', views.project_apply, name='project-apply'),
    path('<int:pk>/submissions/', views.project_submissions, name='project-submissions'),
]