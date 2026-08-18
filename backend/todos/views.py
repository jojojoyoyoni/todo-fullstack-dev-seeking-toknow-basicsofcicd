from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get all completed todos"""
        completed_todos = self.queryset.filter(completed=True)
        serializer = self.get_serializer(completed_todos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending todos"""
        pending_todos = self.queryset.filter(completed=False)
        serializer = self.get_serializer(pending_todos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def clear_completed(self, request):
        """Delete all completed todos"""
        deleted_count = self.queryset.filter(completed=True).delete()[0]
        return Response({'message': f'Deleted {deleted_count} completed todos'})

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()