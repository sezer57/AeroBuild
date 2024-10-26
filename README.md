## AeroBuil Projesi 
Backend : Django + PostgreSQL  
Frontend: Html , Javascript , Jquary ,Tailwind

## Docker ve swagger
`docker-compose up --build`  
port: 8080 frontend  
port: 8000 backend  
Swagger: "localhost:8000/api/swagger"

## Tanıtım ve Ekran Görüntüleri
## Tanım

İlk önce portalın kurulumu yani takım , parça ve uçakların tanımlarının yapılması modellerde type olarak kullanılıcak ve sistem dinamik olucak.
![portalkurulum](https://github.com/user-attachments/assets/165e4de8-799c-488e-bf53-837e6a49ef6d)

Takımları oluşturma:  

![takımtanım](https://github.com/user-attachments/assets/1f0db128-c4f5-4f80-8007-24f60c624437)  

Parça oluşturma takıma bağlı:  

![parçatanım](https://github.com/user-attachments/assets/1924e51a-c5c8-4013-af19-7feeb59df620)  

Uçak oluşturma ve gerekli parçalarını belirleme:  

![uçaktanım](https://github.com/user-attachments/assets/474ddc71-0959-4721-b2db-e04b4640340b)  

Not: yukardakiler sadece tanım içindi .

## Giriş ve kayıt ( kayıt olurken takım seçilmeli)
![giris](https://github.com/user-attachments/assets/0b3faeba-e0a1-4dea-920c-457100a6fdc7)
![kayıt](https://github.com/user-attachments/assets/be6930c9-b450-4357-b2f5-c4308e9abc9a)


## Ansayfa

Anasayfa sistemin bilgilerini ve azalan stokları görüntüleme:

![anasayfa](https://github.com/user-attachments/assets/f0fd6b44-5923-4931-8d81-dcef1d48b7b5)

## Üretim
Üretim ve üretilen parçaların listelenmesi:

![parçalar](https://github.com/user-attachments/assets/0acba41e-963b-4018-b4ce-0981e7cf5fca)  

Parça üretme ayrıca içinde önceden tanımlı olduğu takımının üretme yetkisi olan parça geliyor:

![parça](https://github.com/user-attachments/assets/89525995-1cba-43ca-aad9-efcf0322cfb3)

## Montaj 
Montaj yapılan uçakları listeleme ve montaj yapma (yetki kontrolu üretim yapamaz):

![parçamontajyetkiyok](https://github.com/user-attachments/assets/d9076eb7-29f3-4f15-a9a6-f279dfe434ea)

Eksik parçası olan uçağın montajı yapılmaz:

![montajstoksuz](https://github.com/user-attachments/assets/bc89ebb1-a878-47eb-805e-0988fc35ab41)

Parça tam ve idlerini seçip montaj yapabilir:

![montaj](https://github.com/user-attachments/assets/e229fd59-3040-4f46-9166-c0f5fdad9a43)

Üretilenlerin listelenmesi parçalarıyla birlikte:

![uçaküretim](https://github.com/user-attachments/assets/e48dbf92-c690-4739-8c89-41e2bbbcf8fd)

## Stok
Uçakların hangi parçalarından ne kadar var (kullanılmayan) ve numaraları:

![stok](https://github.com/user-attachments/assets/3d296ecb-0c4b-4f43-aa21-86c243f41aac)
