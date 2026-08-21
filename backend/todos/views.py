from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User

from .models import Todo
from .serializers import TodoSerializer


class RegisterView(APIView):
    permission_classes = [] # Anyone can access this without a token

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.none()
    serializer_class = TodoSerializer
    
    # FIX 1: Enforce that users MUST be logged in to see todos
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get all completed todos"""
        # FIX 2: Use self.get_queryset() instead of self.queryset
        completed_todos = self.get_queryset().filter(completed=True)
        serializer = self.get_serializer(completed_todos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending todos"""
        pending_todos = self.get_queryset().filter(completed=False)
        serializer = self.get_serializer(pending_todos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def clear_completed(self, request):
        """Delete all completed todos"""
        deleted_count = self.get_queryset().filter(completed=True).delete()[0]
        return Response({'message': f'Deleted {deleted_count} completed todos'})

    def perform_create(self, serializer):
        # FIX 3: We know they are authenticated now, so we can simplify this
        serializer.save(user=self.request.user)