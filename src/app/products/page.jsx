
import Products from './Products';

async function Page(props) {
    if(props?.searchParams?.detail) return 
    return (
        <div className='w-full'>
            <Products  />
        </div>
    );
}

export default Page;
  