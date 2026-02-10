export async function GET(request: Request) {
  const result = {
    data: [],
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
