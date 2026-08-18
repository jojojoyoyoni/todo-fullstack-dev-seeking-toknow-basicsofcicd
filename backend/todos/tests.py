from django.test import TestCase
from rest_framework.test import APIClient
from .models import Todo


class TodoModelTest(TestCase):
    """Test the Todo model"""
    
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="Test Description"
        )

    def test_todo_creation(self):
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertFalse(self.todo.completed)
        self.assertEqual(self.todo.priority, 'medium')

    def test_todo_str(self):
        self.assertEqual(str(self.todo), "Test Todo")


class TodoAPITest(TestCase):
    """Test the Todo API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.todo_data = {
            'title': 'New Todo',
            'description': 'New Description',
            'priority': 'high'
        }

    def test_list_todos(self):
        Todo.objects.create(title="Todo 1")
        Todo.objects.create(title="Todo 2")
        response = self.client.get('/api/todos/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_create_todo(self):
        response = self.client.post('/api/todos/', self.todo_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'New Todo')
        self.assertEqual(response.data['priority'], 'high')

    def test_retrieve_todo(self):
        todo = Todo.objects.create(title="Get Todo")
        response = self.client.get(f'/api/todos/{todo.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Get Todo')

    def test_update_todo(self):
        todo = Todo.objects.create(title="Update Me")
        response = self.client.patch(
            f'/api/todos/{todo.id}/',
            {'completed': True},
            format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['completed'])

    def test_delete_todo(self):
        todo = Todo.objects.create(title="Delete Me")
        response = self.client.delete(f'/api/todos/{todo.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Todo.objects.count(), 0)

    def test_completed_endpoint(self):
        Todo.objects.create(title="Done", completed=True)
        Todo.objects.create(title="Not Done", completed=False)
        response = self.client.get('/api/todos/completed/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_pending_endpoint(self):
        Todo.objects.create(title="Done", completed=True)
        Todo.objects.create(title="Not Done", completed=False)
        response = self.client.get('/api/todos/pending/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_clear_completed(self):
        Todo.objects.create(title="Done 1", completed=True)
        Todo.objects.create(title="Done 2", completed=True)
        Todo.objects.create(title="Not Done", completed=False)
        response = self.client.post('/api/todos/clear_completed/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Todo.objects.count(), 1)