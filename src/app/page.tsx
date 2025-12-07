import prisma from '@/lib/db'

async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div className='text-red-400 flex items-center justify-center'>{JSON.stringify(users)}</div>
  )
}

export default Home