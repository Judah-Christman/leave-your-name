'use client'
import { useEffect, useState, FormEvent } from 'react'
import { supabase } from './supabase.js'
import { Filter } from 'bad-words';

const filter = new Filter();

export default function Main() {
  const [names, setNames] = useState<{ id: string; name: string }[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
  fetchNames();
}, []);






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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!newName.trim()) {
    alert('Please enter a name.');
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
    console.log('Insert error:', error);
    alert('Failed to save. Try again.');
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
      <h1 className="text-2xl font-bold mb-4 text-blue-300">Leave A Message!</h1>
      <p className="text-xl p-2 text-blue-300">Enter your message in the form below to add it to the list of other users who have also done so! </p>
      <form onSubmit={handleSubmit} className="mb-6 flex">
        <input
          type="text"
          placeholder="Enter message"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-grow border border-gray-300 p-2 mr-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer">Send</button>
      </form>
      <ul className="space-y-2">
        {names.map((msg, index) => (
          <li key={msg.id} className="border p-2 rounded bg-black-300 text-blue-300 text-lg">
            {msg.id} <p className="w-fit mx-auto">{msg.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
