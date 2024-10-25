from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Team, Component, Aero, AeroStock, Employee  ,ComponentStock
from django.contrib.auth import authenticate, login ,logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from collections import Counter
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from rest_framework import status
from django.middleware.csrf import get_token

####################################################################################

## İlk olarak sistemin hazılanması için parça , takım , uçak tanımlamaları için apiler

### Takım oluşturma apisi ###

class TeamAPI(APIView):
    def post(self, request):
        name = request.POST.get('name')
        assemblyOrProduction = request.POST.get('assemblyOrProduction')
        if name:
            team = Team.objects.create(name=name, assemblyOrProduction=assemblyOrProduction)
            return JsonResponse({'id': team.id, 'name': team.name}, status=200)
        return JsonResponse({'error': 'Name is required'}, status=400)

# Takımlı tanım listeleme apisi

class TeamListAPI(APIView):
    def get(self, request):
        teams = Team.objects.all()
        data = [
            {
                'id': team.id,
                'name': team.name,
                'assemblyOrProduction': team.assemblyOrProduction
            }
            for team in teams
        ]
        return JsonResponse(data, safe=False)


class TeamDetailAPI(APIView):
    def delete(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)
        team.delete()
        return JsonResponse({'message': 'Team deleted successfully'})

### Parça Apileri ####

# Parça tanım oluşturma
class ComponentCreateAPI(APIView):
    def post(self, request):
        name = request.POST.get('name')
        team_id = request.POST.get('team_id')
        team = get_object_or_404(Team, id=team_id)
        
        component = Component.objects.create(name=name, team=team)
        return JsonResponse({'id': component.id, 'team': component.team.id}, status=200)

# Parça tanım listeleme

class ComponentListAPI(APIView):
    def get(self, request):
        components = Component.objects.all()
        data = [
            {
                'id': component.id,
                'name': component.name,
                'team': {
                    'id': component.team.id,
                    'name': component.team.name,
                }
            }
            for component in components
        ]
        return JsonResponse(data, safe=False)

# Id ile tanımlı parça çekme
# Parça tanım silme

class ComponentDetailAPI(APIView):
    def get(self, request, component_id):
        component = get_object_or_404(Component, id=component_id)
        data = {
            'name': component.name,
            'team': component.team.name,
            'aeroID': component.aeroID,
            'isUsed': component.isUsed,
            'createdDate': component.createdDate
        }
        return JsonResponse(data)

    def delete(self, request, component_id):
        component = get_object_or_404(Component, id=component_id)
        component.delete()
        return JsonResponse({'message': 'Component deleted successfully'})


### Uçak Tanımlama API'si ###

class AeroCreateAPI(APIView):
    def post(self, request):
        name = request.POST.get('name')
        component_ids = request.POST.getlist('component_ids[]')  

        # Uçak oluşturma
        aero = Aero.objects.create(name=name)

        # İlgili parçaları ekleme
        for component_id in component_ids:
            component = get_object_or_404(Component, id=component_id)
            aero.needsComponent.add(component)  

        return JsonResponse({
            'id': aero.id,
            'name': aero.name,
            'components': component_ids
        }, status=200)

# Tüm Uçakları Listeleme API'si
class AeroListAPI(APIView):
    def get(self, request):
        aeros = Aero.objects.all()
        data = [
            {
                'id': aero.id,
                "name": aero.name,
                "components": [
                    {
                        "name": component.name
                    }
                    for component in aero.needsComponent.all()  
                ]
            }
            for aero in aeros
        ]
        return JsonResponse(data, safe=False)

# Uçak Detayı Görüntüleme ve Silme API'si
class AeroDetailAPI(APIView):
    def get(self, request, aero_id):
        aero = get_object_or_404(Aero, id=aero_id)
        data = {
            'name': aero.name,
            'component': aero.component.name
        }
        return JsonResponse(data)

    def delete(self, request, aero_id):
        aero = get_object_or_404(Aero, id=aero_id)
        aero.delete()
        return JsonResponse({'message': 'Aero deleted successfully'})

# Personel Apileri
# Personel Oluşturma API'si

@require_http_methods(["POST"]) 
def create_employee(request):
    email = request.POST.get('email')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    hire_date = request.POST.get('hire_date')
    team_id = request.POST.get('team_id')
    password = request.POST.get('password')  
    team = get_object_or_404(Team, id=team_id)

    employee = Employee.objects.create_employee(
        email=email,
        first_name=first_name,
        last_name=last_name,
        hire_date=hire_date,
        team=team,
        password=password  
    )
    return JsonResponse({
        'id': employee.id,
        'email': employee.email,
        'first_name': employee.first_name,
        'last_name': employee.last_name,
        'team': employee.team.id
    })

# Personel Giriş API'si
class EmployeeLoginAPI(APIView):
    def post(self, request):
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Kimlik doğrulama
        employee = authenticate(request, email=email, password=password)
        if employee is not None:
            login(request, employee)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Hatalı giriş'}, status=400)

# Personel Çıkış API'si
@method_decorator(login_required, name='dispatch')
class EmployeeLogoutAPI(APIView):
    def post(self, request):
        logout(request)
        return JsonResponse({'message': 'Başarıyla çıkış yapıldı'})

# Personel Detayı Görüntüleme API'si
class EmployeeDetailAPI(APIView):
    def get(self, request, employee_id):
        employee = get_object_or_404(Employee, id=employee_id)
        data = {
            'email': employee.email,
            'first_name': employee.first_name,
            'last_name': employee.last_name,
            'hire_date': employee.hire_date,
            'team': employee.team.name
        }
        return JsonResponse(data)

# Personelin Takımını Getirme API'si
class EmployeeTeamAPI(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'team_name': request.user.team.name}, safe=False)
        return JsonResponse({'error': 'yetkisiz kullanıcı'}, status=400)

# Personel Silme API'si
class EmployeeDeleteAPI(APIView):
    def delete(self, request, employee_id):
        employee = get_object_or_404(Employee, id=employee_id)
        employee.delete()
        return JsonResponse({'message': 'Employee deleted successfully'})

# Personel Session Kontrol API'si
class EmployeeSessionCheckAPI(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            user_info = f"name: {request.user.first_name} {request.user.last_name}; id: {request.user.id}"
            return JsonResponse({'session_valid': True, 'user_info': user_info})
        else:
            return JsonResponse({'session_valid': False}, status=401)

##################################################################################

## Uçak montaj

# Montaj yapıcak kişinin yetkisini parçanın uçağa ait olup olmadığı kontrolleri

class CreateAeroStockAPI(APIView):
    def post(self, request):
        aeroID = request.data.get('aeroID')
        aero = get_object_or_404(Aero, id=aeroID)
        componentIDs = request.POST.getlist('components[]')
        components_used = ComponentStock.objects.filter(id__in=componentIDs, isUsed=False)

        if components_used.count() == len(componentIDs):
            if request.user.team.assemblyOrProduction:
                aero_stock = AeroStock.objects.create(aeroID=aero)
                aero_stock.components.set(components_used)
                components_used.update(isUsed=True)
                return JsonResponse({'id': aero_stock.id, 'usedComponents': [component.id for component in components_used]})
            return JsonResponse({'message': 'Üretim yetkiniz yok'}, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({'message': 'Bazı bileşenler kullanılmıyor'}, status=status.HTTP_400_BAD_REQUEST)

class GetAeroStockAPI(APIView):
    def get(self, request, stock_id):
        aero_stock = get_object_or_404(AeroStock, id=stock_id)
        data = {
            'usedComponent': aero_stock.usedComponent.name,
            'createdDate': aero_stock.createdDate
        }
        return JsonResponse(data)

class GetStockAerosAPI(APIView):
    def get(self, request):
        draw = int(request.GET.get('draw', 1))
        start = int(request.GET.get('start', 0))
        length = int(request.GET.get('length', 10))

        query = AeroStock.objects.all()
        total_records = query.count()
        paginator = Paginator(query, length)
        page_number = start // length + 1
        page = paginator.get_page(page_number)

        data = [
            {
                "aeroStockID": aero.id,
                "aero": aero.aeroID.name,
                "components": [(f"{component.componentID.name}(id:{component.id})") for component in aero.components.all()],
                "createdDate": aero.createdDate.strftime('%Y-%m-%d'),
            }
            for aero in page.object_list
        ]

        response = {
            'draw': draw,
            'recordsTotal': total_records,
            'recordsFiltered': total_records,
            'data': data,
        }
        return JsonResponse(response)

class DeleteAeroStockAPI(APIView):
    def delete(self, request, stock_id):
        aero_stock = get_object_or_404(AeroStock, id=stock_id)
        aero_stock.delete()
        return JsonResponse({'message': 'AeroStock deleted successfully'})

class GetPermissionBuildAPI(APIView):
    def get(self, request):
        aeroID = request.GET.get('aeroID')
        if not aeroID:
            return JsonResponse({"message": "Girdiğiniz uçak bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        aero_s = get_object_or_404(Aero, id=aeroID)

        if request.user.team.assemblyOrProduction:
            unused_components = ComponentStock.objects.filter(isUsed=False)
            available_components = {}

            for aero_need in aero_s.needsComponent.all():
                available_components[aero_need.name] = {'ids': [], 'count': 0}

            for component_item in unused_components:
                for aero_need in aero_s.needsComponent.all():
                    if aero_need.name == component_item.componentID.name and aero_s.name == component_item.aeroID.name:
                        available_components[aero_need.name]['ids'].append(component_item.id)
                        available_components[aero_need.name]['count'] = len(available_components[aero_need.name]['ids'])

            merged_components = [{'name': name, 'ids': data['ids'], 'count': data['count']} for name, data in available_components.items()]
            return JsonResponse({"available_components": merged_components}, status=status.HTTP_200_OK)

        return JsonResponse({"message": "Montaj izniniz yok"}, status=status.HTTP_403_FORBIDDEN)


###################################
# Parça üretim ve kontrol apisi

# Parça stok listeleme apisi datatable ile

class GetStockComponentsAPI(APIView):
    def get(self, request):
        draw = int(request.GET.get('draw', 1))
        start = int(request.GET.get('start', 0))
        length = int(request.GET.get('length', 10))

        query = ComponentStock.objects.all()
        total_records = query.count()

        paginator = Paginator(query, length)
        page_number = start // length + 1
        page = paginator.get_page(page_number)

        data = [
            {
                "componentID": component.id,
                "aero": component.aeroID.name,
                "component": component.componentID.name,
                "employee": f"{component.employee.first_name} {component.employee.last_name} ({component.employee.team.name})",
                "createdDate": component.createdDate.strftime('%Y-%m-%d'),
                "isUsed": "Kullanıldı" if component.isUsed else "Kullanılmadı"
            }
            for component in page.object_list
        ]

        response = {
            'draw': draw,
            'recordsTotal': total_records,
            'recordsFiltered': total_records,
            'data': data,
        }

        return JsonResponse(response)

# Parça üretim apisi takımını kontrol etme parçayi üretme yetkisini kontrol etme hangi parça
# için çalıştığını ve doğruluğunu kontrol etme gerçekleştirildi 

class CreateComponentStockAPI(APIView):
    def post(self, request):
        aeroID = request.data.get('aeroID')
        componentID = request.data.get('componentID')
        employeeID = request.data.get('employeeID')
        createdDate = request.data.get('createdDate')

        aero_s = get_object_or_404(Aero, id=aeroID)
        employee_s = get_object_or_404(Employee, id=employeeID)
        component_s = get_object_or_404(Component, id=componentID)

        # İzin kontrolü
        if not employee_s.team.assemblyOrProduction:
            # Çalışan takımının izin verilen bileşenlerini kontrol et
            allowed_components = employee_s.team.components.all()
            if component_s in allowed_components:
                componentStock = ComponentStock.objects.create(
                    componentID=component_s,
                    employee=employee_s,
                    aeroID=aero_s,
                    createdDate=createdDate,
                    isUsed=False
                )
                return JsonResponse({"message": "Parça başarıyla üretildi"})
            else:
                return JsonResponse({"message": "Bu parça üretimi için izin yok"}, status=status.HTTP_403_FORBIDDEN)
        else:
            return JsonResponse({"message": "Üretim izniniz yok"}, status=status.HTTP_403_FORBIDDEN)


class DeleteComponentStockAPI(APIView):
    def delete(self, request):
        componentStockID = request.data.get('componentStockID')
        componentStock = get_object_or_404(CompenentStock,id=componentStockID)
        componentStock.delete()
        return JsonResponse({'message': 'Parça geri dönüştürüldü.'})
        



# Parça üretim kontrolu arayüzden parça üretmek istediğinde hangi parçaları üretmek için yetkisi
# olduğunu ve hangi uçak için üretim yapabileceğinin bilgisini arayüze gönderme

class GetPermissionComponentAPI(APIView):
    def get(self, request):
        aeros = Aero.objects.all()
        employee = get_object_or_404(Employee, id=request.user.id)

        if not employee.team.assemblyOrProduction:
            components = employee.team.components.all().values('id', 'name')
            components_list = [{"id": component["id"], "name": component["name"]} for component in components]
            aeros_list = [{"id": aero.id, "name": aero.name} for aero in aeros]
            return JsonResponse({
                "team": employee.team.name,
                "your_permission_component": components_list,
                "aero_list": aeros_list
            })
        else:
            return JsonResponse({"message": "Üretim izniniz yok"}, status=status.HTTP_403_FORBIDDEN)


##############################################################

# Dashborda bilgileri yazdırma
class GetDashboardAPI(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"message": "Giriş yapmanız gerekmektedir"}, status=status.HTTP_403_FORBIDDEN)

        aeros_count = AeroStock.objects.count()
        employee_count = Employee.objects.count()
        component_count = ComponentStock.objects.count()
        team_count = Team.objects.count()

        context = {
            'aeros_count': aeros_count,
            'employee_count': employee_count,
            'component_count': component_count,
            'team_count': team_count,
        }

        return JsonResponse(context)

# Bütün uçaklar için stokları listeleme

class GetAllStockAPI(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            all_available_components = {}

            for aero in Aero.objects.all():
                unused_components = ComponentStock.objects.filter(isUsed=False, aeroID=aero.id)
                available_components = {}

                for aero_need in aero.needsComponent.all():
                    available_components[aero_need.name] = {'ids': [], 'count': 0}

                for component_item in unused_components:
                    for aero_need in aero.needsComponent.all():
                        if aero_need.name == component_item.componentID.name:
                            available_components[aero_need.name]['ids'].append(component_item.id)
                            available_components[aero_need.name]['count'] = len(available_components[aero_need.name]['ids'])

                all_available_components[aero.name] = [
                    {'name': name, 'ids': data['ids'], 'count': data['count']}
                    for name, data in available_components.items()
                ]

            if all_available_components:
                return JsonResponse({"all_available_components": all_available_components}, status=status.HTTP_200_OK)

            return JsonResponse({"message": "Stokda parça yok"}, status=status.HTTP_404_NOT_FOUND)

        return JsonResponse({"message": "Giriş yapınız"}, status=status.HTTP_403_FORBIDDEN)
    
def get_csrf_token(request):
  
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

