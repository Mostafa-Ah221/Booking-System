import { workspaceAction } from "../slices/workspaceSlice";
import toast from 'react-hot-toast';

import axios from "axios";

export function getWorkspace(){
    return async (dispatch) => {
            try {
                const Token = localStorage.getItem("access_token");
                const response = await axios.get(
                  "https://booking-system-demo.efc-eg.com/api/workspace/index",
                  {
                    headers: {
                      "Content-Type": "application/json",
                      authorization: Token,
                    },
                  }
                );
                // console.log(response.data?.data.workspaces);
                dispatch(workspaceAction.setWorkspaces(response?.data?.data.workspaces));

              } catch (error) {
                console.error("Error fetching workspaces:", error);
                
              }
    }
}

// create a new workspace
 export function createWorkSpace(namespace) {
  return async (dispatch) => {
    try {
       const Token = localStorage.getItem("access_token");
      const response = await axios.post(
        `https://booking-system-demo.efc-eg.com/api/workspace/store`,
        { name: namespace },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
      
      if (response?.data?.message) {
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
          padding: '12px 16px',
          fontWeight: '500',
          },
        });
        
        return { success: true };
      } 
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };
}

  // Fetch the updated ًWork-space data
export function updataWorkspace(id, name) {
  return async (dispatch) => {
    try {
      const Token = localStorage.getItem("access_token");
      
      const response = await axios.post(
        `https://booking-system-demo.efc-eg.com/api/workspace/update/${id}`,
        { name: name },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
          padding: '12px 16px',
          fontWeight: '500',
          },
        });
        return {
          success: true,
          message: response?.data.message
          
        };
        
      }
      
    } catch (error) {
      console.error("Error updating work space:", error);
      return {
        success: false,
        message: error.response?.data?.message 
      };
    }
  };
}
  export function deleteWorkspace (id){
    return async (dispatch) => {
      try {
          const Token = localStorage.getItem("access_token");
          const response= await axios.delete(`https://booking-system-demo.efc-eg.com/api/workspace/delete/${id}`,
            {
            headers: {
              "Content-Type": "application/json",
              authorization: Token,
            },
          }
          )
           if (response.data.status) {
            toast.success(response?.data?.message, {
              position: 'top-center',         
              duration: 5000,
              icon: '✅',
              style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
              padding: '12px 16px',
              fontWeight: '500',
              },
            });
            dispatch(getWorkspace());
            return {
              success: true,
              message: response?.data.message
            };
          }
      } catch (error) {
          console.error("Error updating work space :", error);
      }
    }
  }
