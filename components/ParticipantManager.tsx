import React, { useState } from 'react';
import { Participant } from '../types';
import { Plus, X, Users } from 'lucide-react';

interface ParticipantManagerProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

const ParticipantManager: React.FC<ParticipantManagerProps> = ({ participants, onAdd, onRemove }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-800">Participants</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add name (e.g. Rohit)"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {participants.length === 0 && (
          <p className="text-gray-400 text-sm italic">No participants yet. Add someone to start!</p>
        )}
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium animate-fadeIn"
          >
            <span>{p.name}</span>
            <button
              onClick={() => onRemove(p.id)}
              className="text-primary-400 hover:text-red-500 transition-colors"
              aria-label={`Remove ${p.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantManager;