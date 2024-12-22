import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { StorageService } from '../services/storage';

const Button = ({ children, onClick, variant = 'default', size = 'default', className = '' }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const PromisesApp = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    const isAvailable = StorageService.isAvailable();
    setStorageAvailable(isAvailable);
    
    if (isAvailable) {
      const savedPromises = StorageService.loadPromises();
      setPromises(savedPromises);
    }
  }, []);

  useEffect(() => {
    if (storageAvailable) {
      StorageService.savePromises(promises);
    }
  }, [promises, storageAvailable]);

  const addPromise = () => {
    if (newPromise.trim()) {
      const promise = {
        id: Date.now(),
        text: newPromise,
        status: 'pending',
        date: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setPromises(prev => [...prev, promise]);
      setNewPromise('');
    }
  };

  const deletePromise = (id) => {
    setPromises(prev => prev.filter(p => p.id !== id));
  };

  const updateStatus = (id, status) => {
    setPromises(prev => prev.map(p => 
      p.id === id 
        ? { ...p, status, lastModified: new Date().toISOString() } 
        : p
    ));
  };

  const startEditing = (promise) => {
    setEditingId(promise.id);
    setEditText(promise.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setPromises(prev => prev.map(p => 
        p.id === editingId 
          ? { ...p, text: editText, lastModified: new Date().toISOString() } 
          : p
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'fulfilled': return 'text-green-600';
      case 'broken': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!storageAvailable && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          ⚠️ El almacenamiento local no está disponible. Tus promesas no se guardarán entre sesiones.
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Mis Promesas</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPromise}
            onChange={(e) => setNewPromise(e.target.value)}
            placeholder="Escribe tu nueva promesa..."
            onKeyPress={(e) => e.key === 'Enter' && addPromise()}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={addPromise}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {promises.map(promise => (
          <div key={promise.id} className="bg-white rounded-lg shadow-md p-6">
            {editingId === promise.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={saveEdit} variant="outline" size="icon">
                  <Check className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setEditingId(null)} 
                  variant="outline" 
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <p className={`text-lg mb-4 ${getStatusColor(promise.status)}`}>
                  {promise.text}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={promise.status === 'pending'}
                        onChange={() => updateStatus(promise.id, 'pending')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Pendiente</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={promise.status === 'fulfilled'}
                        onChange={() => updateStatus(promise.id, 'fulfilled')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Cumplida</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={promise.status === 'broken'}
                        onChange={() => updateStatus(promise.id, 'broken')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Rota</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => startEditing(promise)} 
                      variant="outline" 
                      size="icon"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => deletePromise(promise.id)} 
                      variant="outline" 
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromisesApp;