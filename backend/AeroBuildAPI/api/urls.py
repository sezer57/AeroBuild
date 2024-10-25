from django.urls import path, include  
from . import views 
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title='AeroBuild API',
        default_version='v1',
        description='AeroBuild API ',
        terms_of_service='https://www.google.com/policies/terms/',
        contact=openapi.Contact(email='contact@example.local'),
        license=openapi.License(name='BSD License'),
    ), 
    public=True,
)

urlpatterns = [

    # Takım endpoints
    path('api/team/create/', views.TeamAPI.as_view(), name='team-create'),
    path('api/team/getAll/', views.TeamListAPI.as_view(), name='team-get'),
    path('api/team/<int:team_id>/delete/', views.TeamDetailAPI.as_view(), name='team-detail'),

    # Personel Kayıt , Id ile çekme , Silme
    path('api/employee/register/', views.create_employee, name='employee-register'),
    path('api/employee/login/', views.EmployeeLoginAPI.as_view(), name='employee-login'),
    path('api/employee/logout/', views.EmployeeLogoutAPI.as_view(), name='employee-logout'),
    path('api/employee/<int:employee_id>/', views.EmployeeDetailAPI.as_view(), name='employee-detail'),
    path('api/employee/team/', views.EmployeeTeamAPI.as_view(), name='employee-team'),
    path('api/employee/<int:employee_id>/delete/', views.EmployeeDeleteAPI.as_view(), name='employee-delete'),
    path('api/employee/session/', views.EmployeeSessionCheckAPI.as_view(), name='employee-session-check'),

    
    # Parça endpoints
    path('api/component/create/', views.ComponentCreateAPI.as_view(), name='component-create'),
    path('api/component/getAll/', views.ComponentListAPI.as_view(), name='component-get'),
    path('api/component/<int:component_id>/', views.ComponentDetailAPI.as_view(), name='component-detail'),

    # Uçak endpoints
    path('api/aero/create/', views.AeroCreateAPI.as_view(), name='aero-create'),
    path('api/aero/getAll/', views.AeroListAPI.as_view(), name='aero-get'),
    path('api/aero/<int:aero_id>/', views.AeroDetailAPI.as_view(), name='aero-detail'),


     # UçakStok endpoints
    path('api/aerostock/create/', views.CreateAeroStockAPI.as_view(), name='aerostock'),
    path('api/aerostock/getAll/', views.GetStockAerosAPI.as_view(), name='aerostock-getAll'),
    path('api/aerostock/<int:stock_id>/', views.GetAeroStockAPI.as_view(), name='aerostock-detail'),
    path('api/aerostock/<int:stock_id>/delete/', views.DeleteAeroStockAPI.as_view(), name='aerostock-delete'),

    # Stok parçaları
    path('api/componentStock/permissionComponent/', views.GetPermissionComponentAPI.as_view(), name='componentstock-permission'),
    path('api/componentStock/getAll/', views.GetStockComponentsAPI.as_view(), name='componentstock-getAll'),
    path('api/componentStock/create/', views.CreateComponentStockAPI.as_view(), name='componentstock-create'),
    path('api/componentStock/delete/<int:stock_id>/', views.DeleteComponentStockAPI.as_view(), name='componentstock-create'),

    # Dashboard ekranı için gerekli bilgiler
    path('api/dashboard/', views.GetDashboardAPI.as_view(), name='dashboard'),

    # Üretim için izin ve gerekli parça kontrol
    path('api/aerostock/permissionBuil/', views.GetPermissionBuildAPI.as_view(), name='get_permissionBuild'),

    # Stok listeme
    path('api/stock/getAll/', views.GetAllStockAPI.as_view(), name='get_AllStock'),

    path('api/CSRF/', views.get_csrf_token, name='get_csrf_token'),

    path('api/', include([
        path("swagger/", schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path("redoc/", schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ])),
]
