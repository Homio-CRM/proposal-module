import { useQuery  } from 'react-query'
import axios from 'axios'





export const useFetch = (userUrl: string) => {
    const config = {
        headers:{
          Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`
        }
      }
    
      const url = `https://cms.celmedia.com.br/items/students?&filter[MG_URL][_eq]=${userUrl}&fields=Name,Instagram_URL,MG_Email,MG_URL,Phone`
      return useQuery({
            queryFn: async () =>{
            const  { data }  = await axios.get(url, config)
            return  data
          },
      })

}



  