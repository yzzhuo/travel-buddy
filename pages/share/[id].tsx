import LoadingDots from '@/components/LoadingDots';
import TravelPlanReport from '@/components/TravelPlanReport';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { PlanResult } from '@/lib/types';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';


interface Preference {
  destination: string;
  startDate: string;
  duration: number;
}
export default function SharePage() {
  const router = useRouter()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [data, setData] = useState<null|PlanResult>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (router.query.id) {
      getSharedItinerary(router.query.id as string)
    }
  }, [router.query.id])

  const getSharedItinerary = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/itinerary?id=${id}`)
      const data = await res.json()
      if (!data) {
        toast.error('Itinerary not found')
        return
      }
      setData(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch itinerary')
    } finally{
      setLoading(false)
    }
  }
  const onClickStart = async() => {
   // navigate to the home page
    router.push('/')
  }

  const onClickShareLink = async() => {
    if (isCopied) return
    copyToClipboard(window.location.href)
    toast.success('Link copied to clipboard')
  }
  return (
    <div className="flex flex-col w-full mx-auto stretch">
      <Head>
        <title>tourbuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='w-full relative min-h-screen flex flex-col' style={{paddingBottom: '106px'}}>
        <div className='flex justify-end pt-2 px-2'>
          {!loading && data && <button className="btn btn-circle btn-md " onClick={onClickShareLink}>
            <ArrowUpOnSquareIcon className="h-4 w-4" />
          </button>
            }
        </div>
        {data && <TravelPlanReport 
          data={data} 
          onChangeData={() => {}}
        />   
        }
        {loading && <div className='flex justify-center items-center flex-auto'>
          <LoadingDots color="black" style="large" />
          </div>      
        }
        <Toaster position='top-center' />
        <div className='fixed w-full bottom-0 flex justify-center py-4 px-4 bg-white border flex-col items-center shadow-lg'>
          <button className='btn btn-neutral' onClick={onClickStart}>Get Start with Tourbuddy</button>
          <aside className='text-xs text-gray-500 mt-2'>
            <p>Copyright © 2024 - All right reserved by Tourbuddy</p>
          </aside>
        </div>
      </main>
    </div>
    )
};

