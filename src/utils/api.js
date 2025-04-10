export function getBaseUrl() {
  if (!window.location.href.includes('localhost')) {
    return "https://webshop-2025-be-g7.vercel.app/"
  }
  return "http://localhost:3000/";
}

export async function fetchProducts(endpoint = "api/products") {
  //! DONT USE THIS IN PRODUCTION
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return [];
}

export async function addProducts(product, endpoint = "api/products") {
  const url = `${getBaseUrl()}${endpoint}`;
  let user = JSON.parse(localStorage.getItem("user"));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();
  console.log("Added Product:", data);
}

export async function getCategories(endpoint = "api/categories") {
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
}

export async function buyItems(items, endpoint = "api/orders") {
  const url = `${getBaseUrl()}${endpoint}`;
  let user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(items)
    });
    if (!response.ok) {
      console.error("Request failed with status:", response.status);
      return false;
    }
    const data = await response.json();
    console.log("Bought items:", data);
    return true;
  } catch (error) {
    console.error("Error detected:", error);
    return false;
  }
}

export async function updateProduct(product, id, endpoint = "api/products/") {
  const url = `${getBaseUrl()}${endpoint}${id}`;
  console.log(id)
  let user = JSON.parse(localStorage.getItem("user"));
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();
  console.log("Added Product:", data);
}

export async function checkAdmin(endpoint = "api/auth/me") {
  try {
    const url = `${getBaseUrl()}${endpoint}`;
    let user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return (data.user.isAdmin);
  } catch (error) {

  }
}