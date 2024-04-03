import { useEffect } from "react";

export default function Test() {
  const getUsers = async () => {
    // setLoading(true);
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    console.log('result:', result);
    return result
  };

  useEffect(() => {
    getUsers();
  }
  , []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      test
    </main>
  )
}
