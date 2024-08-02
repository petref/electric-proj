'use client'
import { useRouter } from 'next/router';
import Chart from "chart.js/auto";
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { CategoryScale } from "chart.js";
import { Line } from 'react-chartjs-2';

import ApiFacade from '../../services/api/';
import Loader from '../../components/loader';

Chart.register(CategoryScale);

const DetailPage = () => {
  const router = useRouter();
  const { region: regionId } = router.query;
  console.log(regionId)
  const { data, error, isLoading } = useQuery(
    ['regionData', regionId],
    () => ApiFacade.getRegionPrices(regionId as any ),
    { enabled: !!regionId }
  );
  const { data: regionsData, error: errorPublicPower, isLoading: isLoadingPublicPower } = useQuery(
    ['publicPower', regionId],
    () => ApiFacade.getPublicPower(regionId as any),
    { enabled: !!regionId }
  );


  if (isLoading) return <Loader />;
  if (error) return <div><Loader />Error fetching data</div>;
  if (!regionsData || !data) return <div><Loader /><span>Error fetching data from Api</span></div>;
  // Prepare chart data
  const chartData = (unix_seconds: string[], values: string[]) => ({
    labels: unix_seconds.map((el: any) => {
      const date = new Date(el * 1000);
      return `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}`
    }),
    datasets: [
      {
        label: 'Price',
        data: values,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Electricity Prices for {regionId}</h1>
      <Tabs defaultValue="prices" className="w-[80vw]">
        <TabsList>
          <TabsTrigger value="prices">Current Prices</TabsTrigger>
          <TabsTrigger value="others">Daily Statistics</TabsTrigger>
          <TabsTrigger value="publicPower">Public Power</TabsTrigger>
        </TabsList>
        <TabsContent value="prices">
          <div>
            <Line data={chartData(data?.unix_seconds, data?.price)} width={"500px"} height={"150px"} />
          </div>
        </TabsContent>
        <TabsContent value="others">
          {data && (
            <div>
              <p>High: {data?.price.sort((a:string, b:string) => +b - +a)[0]} €/MWh</p>
              <p>Low: {data?.price.sort((a:string, b:string) => +b - +a)[data?.price.length - 1]} €/MWh</p>
              <p>Average:{data?.price.reduce((acc:number, curr:string, _:any, { length }: {length: number}) => acc + +curr / length, 0)} €/MWh</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="publicPower">
          <div>
            {regionsData && (
              <div>
                {regionsData.map((publicPowerData: any, index: number) => (
                  <div key={`${publicPowerData}`} className='grid grid-cols-2 grid-flow-row gap-4 border rounded p-2'>
                    {publicPowerData.production_types.map((productionType:any) => (
                      <div key={productionType} className='my-5 border rounded p-5'>
                        <div>{`${productionType.name}`}</div>
                        <Line key={productionType.name} data={chartData(publicPowerData?.unix_seconds, productionType.data)} width={"250px"} height={"100px"} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailPage;