import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

function App() {
  const BASE_URL = "http://localhost:5001";
  
  const [todos, setTodos] = useState();
  console.log("ye todos he",todos)
  const [isEditing, setIsEdeting] = useState();

  const getTodo = async () => {
    const response = await axios(`${BASE_URL}/api/v1/todos`);
    const todosfromServer = response?.data?.data;
    // console.log("todosfromServer", todosfromServer);

    const newNew = todosfromServer.map((todo)=>{
      return{...todo , isEditing: false}
    })
    setTodos(newNew);
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    try {
      event.preventDefault();
      const todoValue = event.target.children[0].value;
      // console.log(todoValue);
      const { data } = await axios.post(`${BASE_URL}/api/v1/todo`, {
        todo: todoValue,
      });

      getTodo();
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      // console.log("todoId", todoId);

      const res = await axios.delete(`${BASE_URL}/api/v1/todo/${todoId}`);

      toast.success(res.data?.message);
      getTodo();
    } catch (error) {
      toast.error(res.error?.response.data?.message || "unknown error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg p-10 bg-gray-800 rounded-3xl shadow-2xl space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-white">
          ToDo App
        </h1>

        <form className="flex items-center space-x-4" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-6 py-4 rounded-full border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 text-lg bg-gray-700 text-white transition-all duration-300"
          />
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none transition duration-300 transform hover:scale-105">
            Add
          </button>
        </form>

        {/* jb todo list empty ho hogi to ye show hoga */}
        {/* {!todos.length && "List is empty"}  */}
        <ul className="space-y-5">
          {todos?.map((todo,index) => (
            <li
              key={todo.id}
              className="flex justify-between items-center bg-gray-700 p-5 rounded-2xl shadow-xl transition-all hover:shadow-2xl"
            >
               {!isEditing ? <span className="text-lg text-gray-300">{todo.todoContent}</span>:
               <input type="text" />
               }
              <div className="space-x-4">
                <button 
                onClick={() => {
                  todos[index].isEditing = true ;

                  setTodos([...todos])
                }}
                className="text-indigo-400 hover:text-indigo-500 transition duration-300">
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-500 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
