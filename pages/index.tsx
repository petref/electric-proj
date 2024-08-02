import { useState } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import ApiFacade from '../services/api';


export default function OverviewPage () {
  const [ search, setSearch ] = useState(" ");

  const { data, error, isLoading, isFetched } = useQuery(['regions'], ApiFacade.getRegionWithPrices, { cacheTime: 3000 });

  return (<>
  OverView
  </>)
}