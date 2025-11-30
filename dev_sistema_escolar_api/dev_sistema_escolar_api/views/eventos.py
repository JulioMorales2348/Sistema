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

    # Obtener lista de eventos (GET)
    def get(self, request):
        # Obtenemos todos los eventos de la BD
        eventos = Eventos.objects.all().order_by('id')
        serializer = EventosSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
