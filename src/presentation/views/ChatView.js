import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../../core/auth/AuthContext'; // Importar el contexto de autenticación

function ChatView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Inicialmente vacío
  const [activeChat, setActiveChat] = useState(null);
  const { isAuthenticated, user,  jobTitle  } = useContext(AuthContext); // Obtener el estado de autenticación, información del usuario y roles

  // Recuperar el historial desde localStorage al cargar el componente
  useEffect(() => {
    const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setChatHistory(savedChatHistory);

    // Si hay chats guardados, seleccionar el último activo
    if (savedChatHistory.length > 0) {
      setActiveChat(savedChatHistory[savedChatHistory.length - 1].id);
      setMessages(savedChatHistory[savedChatHistory.length - 1].messages);
    }
  }, []);

  // Guardar el historial en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Función para crear un nuevo chat
  const createNewChat = () => {
    const newChatId = chatHistory.length + 1; // Generar un ID único
    const newChat = {
      id: newChatId,
      name: `Chat ${newChatId}`,
      messages: [],
    };
    setChatHistory([...chatHistory, newChat]);
    setActiveChat(newChatId); // Cambiar automáticamente al nuevo chat
    setMessages([]); // Limpiar los mensajes actuales
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, user_id: 'default_user' };
      const updatedMessages = [...messages, { sender: 'user', text: input }];
      setMessages(updatedMessages);
      setInput('');
      setIsBotTyping(true);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/process_message/', userMessage);
        const botMessage = { sender: 'bot', text: response.data.response };
        setMessages([...updatedMessages, botMessage]);

        // Actualizar el historial de chats
        setChatHistory((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat
              ? { ...chat, messages: [...chat.messages, userMessage, botMessage] }
              : chat
          )
        );
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      } finally {
        setIsBotTyping(false);
      }
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    setMessages(selectedChat.messages);
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Barra lateral (Historial de chats) */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5>Historial de Chats</h5>
              <button className="btn btn-light btn-sm" onClick={createNewChat}>
                Nuevo Chat
              </button>
            </div>
            <div className="card-body" style={{ height: '80vh', overflowY: 'auto' }}>
              <ul className="list-group">
                {chatHistory.map((chat) => (
                  <li
                    key={chat.id}
                    className={`list-group-item ${
                      chat.id === activeChat ? 'active' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    {chat.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Área principal (Mensajes del chat) */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5>Chat</h5>
              {isAuthenticated && user && ( // Mostrar información del usuario si está autenticado
                <div>
                  <p className="mb-0">Bienvenido, {user.name}!</p>
                  <small>Correo: {user.username}</small>
                  <br />
                  <small>Puesto: {jobTitle}</small> {/* Mostrar puesto */}
                </div>
                
              )}
            </div>
            <div className="card-body" style={{ height: '70vh', overflowY: 'auto' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-${
                    msg.sender === 'user' ? 'end' : 'start'
                  } mb-3`}
                >
                  <div
                    className={`p-3 rounded ${
                      msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'
                    }`}
                  >
                    <strong>{msg.sender === 'user' ? 'Tú' : 'Chatbot'}:</strong> {msg.text}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="p-3 rounded bg-light">
                    <em>Chatbot está escribiendo...</em>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe tu mensaje..."
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;