import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Input } from "../components/ui/input"
import { cn } from "../lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import Loader from '../components/loader';
import ApiFacade from '../services/api';


export default function OverviewPage() {
  const [search, setSearch] = useState(" ");

  const { data, error, isLoading, isFetched } = useQuery(['regions'], ApiFacade.getRegionWithPrices, { cacheTime: 3000 });
  if (isLoading) return <Loader />
  if (error) return <div>Error fetching data</div>;

  const filteredRegions = data.regions.filter((region) =>
    region.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-center container">
      <h1 className="text-2xl font-bold">Electricity Prices Overview</h1>
      <div>
        <Input
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder='Search...'
        />
      </div>
      <div className="h-screen my-5 overflow-y-scroll">
        {filteredRegions.map((region) => (
          <Link href={`/region/${region.id}`}>
            <Card
              key={region.id}
              className={cn("m-4 p-5 border rounded overflow-hidden")}
            >
              <CardHeader>
                <CardTitle>
                  {region.name}
                </CardTitle>
              </CardHeader>
              <CardContent >
                {region.id}: {`${region.currentPrice} ${region.unit}`}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}