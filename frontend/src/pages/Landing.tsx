import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';

import hero from '@/assets/hero.svg';


function Landing() {
  return (
    <main>
        <h1 className="text-5xl mt-10 mb-5">MarketWatch DB Project</h1>
        <p>
            By Alexia A, Brayton B, Daniel V, &amp; William Q
        </p>
        <div className='flex place-items-center my-20' style={{height: 'calc(10rem + 15vh + 5vw)'}}>
            <img src={hero} alt="" className='h-full w-full' style={{objectFit: 'contain'}} />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Button asChild className="!text-white">
                <a href="https://github.com/Daniel6278/marketwatch-db" target="_blank">GitHub Repo</a>
            </Button>
            <Button asChild className="!text-white">
                <a href="https://github.com/Daniel6278/marketwatch-db/tree/main/backend/api/sql" target="_blank">SQL Code</a>
            </Button>
            <Button asChild className="!text-white">
                <a href="https://github.com/Daniel6278/marketwatch-db/tree/main/backend/api/API_ENDPOINTS_DOCUMENTATION.md" target="_blank">API Documentation</a>
            </Button>
        </div>
    </main>
  );
}

export default Landing;