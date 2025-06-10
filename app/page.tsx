'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { Filter } from 'bad-words';

const filter = new Filter();

export default function Main() {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");






  async function fetchNames() {
    const { data, error } = await supabase
      .from('Example')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Fetch error:', error);
    } else {
      setNames(data);
    }
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   if (!newName.trim()) return; // prevent blank inputs

  //   const { data, error } = await supabase
  //     .from('Example')
  //     .insert([{ name: newName }]);

  //   if (error) {
  //     console.log('Insert error:', error);
  //   } else {
  //     // setNames([data[0], ...names]);
  //     setNewName('');
  //     await fetchNames();
  //   }
  //   setNewName('');
  //   inputRef.current?.focus();
  // }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!newName.trim()) {
    setErrorMessage('Please enter a name.');
    return;
  }

  if (filter.isProfane(newName)) {
    alert('Please avoid using inappropriate language.');
    return;
  }


  const { data, error } = await supabase
    .from('Example')
    .insert([{ name: newName }])
    .select(); // this ensures data is returned

  if (error) {
    console.error('Insert error:', error);
    setErrorMessage('Failed to save. Try again.');
  } else {
    setNewName('');
    if (data && data.length > 0) {
      setNames([data[0], ...names]);
    } else {
      await fetchNames(); // fallback if no data returned
    }
  }
}

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-300">Leave Your Name!</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex">
        <input
          type="text"
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-grow border border-gray-300 p-2 mr-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer">Send</button>
      </form>
      <ul className="space-y-2">
        {names.map((msg) => (
          <li key={msg.id} className="border p-2 rounded bg-black-300 text-blue-300 text-center text-lg">
            {msg.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
