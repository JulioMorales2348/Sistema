from django.shortcuts import render
from django.db.models import *
from django.db import transaction
from dev_sistema_escolar_api.serializers import EventosSerializer
from dev_sistema_escolar_api.models import Eventos
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status 
from rest_framework import permissions 


class EventosView(APIView):
    # Aseguramos que requiera autenticación 
    permission_classes = [permissions.IsAuthenticated]
    
    # Registrar nuevo evento
    @transaction.atomic
    def post(self, request):
        print("Datos recibidos:", request.data) 
        
        serializer = EventosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Evento registrado correctamente"}, status=status.HTTP_201_CREATED)
        
        print("Errores de validación:", serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)