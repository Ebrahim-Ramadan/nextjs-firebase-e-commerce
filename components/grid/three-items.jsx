import { GridTileImage } from '@/components/grid/tile';
import Link from 'next/link';


function ThreeItemGridItem({
  item,
  size,
  priority
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/frame/${item?.id}?type=${item?.type[0]}&size=${item?.sizes[0]}&color=${item?.color[0]}`}
      >
        <GridTileImage
       categories={item.categories}
          src={`https://iili.io/${item && item['images'][0].match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg`}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item['name']}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item['name'] ,
            amount: item.price,
            currencyCode: 'EGP'
          }}
        />
      </Link>
    </div>
  );
}

export  function ThreeItemGrid({data}) {
  console.log('data', data);
  return (
 <div className='w-full gap-2 flex flex-col mt-2 scroll-smooth scroll-mt-4' id="FEATURING">
  
    <div className="flex items-center justify-between">
  <div className="h-0.5 bg-blue-400 w-1/5"></div>
  <a className="mx-2 text-xl font-bold scroll-smooth" href="#FEATURING">FEATURING</a>
  <div className="h-0.5 bg-blue-400 w-1/5"></div>
</div>
    <div className='flex font-bold flex-row items-center justify-end w-full px-2'>
<p className='rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
  NEW
</p>
    </div>

<section className=" grid gap-4  pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
  <ThreeItemGridItem size="full" item={data[Math.floor(Math.random() * 18) + 1]} priority={true} />
  <ThreeItemGridItem size="half" item={data[Math.floor(Math.random() * 18) + 1]} priority={true} />
  <ThreeItemGridItem size="half" item={data[Math.floor(Math.random() * 18) + 1]} />
</section>
 </div>
  );
}
