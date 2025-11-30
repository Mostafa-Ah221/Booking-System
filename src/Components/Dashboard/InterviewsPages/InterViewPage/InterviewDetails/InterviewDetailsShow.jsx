import { IoIosCamera } from "react-icons/io";

const InterviewDetailsShow = ({ interview, canEdit, onEditClick }) => {
  console.log(interview);
  
  return (
    <div className="w-full bg-white mt-2 px-6 rounded-lg mx-5 text-sm">
      <div className="flex items-start gap-4 mb-8 pb-4 border-b">
        <div
          className="bg-purple-300 w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer hover:bg-purple-400 duration-200 relative overflow-hidden"
        >
          {interview?.photo ? (
            <>
              <img className="w-full h-full rounded object-cover" src={interview.photo} alt="profile" />
              <span className="w-full h-full absolute top-0 left-0 flex justify-center items-center group">
                <span className="group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800"></span>
                <IoIosCamera className="absolute text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              </span>
            </>
          ) : (
            <span>{interview?.name ? interview.name.charAt(0).toUpperCase() : '?'}</span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-800 truncate block max-w-[150px]">{interview?.name}</h2>
          <p className="text-gray-600">{interview?.type}</p>
        </div>
        {canEdit && (
          <button
            onClick={onEditClick}
            className="ml-auto px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Event Type Name</h4>
            <p className="text-gray-800 font-medium truncate block max-w-[150px]">{interview?.name || "Not specified"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Type</h4>
            <p className="text-gray-800 font-medium">{interview?.type || "Not specified"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Workspace</h4>
            <p className="text-gray-800 font-medium">{interview?.workspace_name }</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Duration</h4>
            <p className="text-gray-800 font-medium">
              {interview?.duration_cycle ? `${interview.duration_cycle} ${interview.duration_period}` : "Not specified"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Rest Cycle</h4>
            <p className="text-gray-800 font-medium">
              {interview?.rest_cycle ? `${interview.rest_cycle} minutes` : "Not specified"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
            <p className="text-gray-800 font-medium">{interview?.status_of_pay || "Not specified"}</p>
          </div>
          {interview?.status_of_pay === "paid" && (
             <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Price</h4>
            <p className="text-gray-800 font-medium">
              {interview?.price && interview?.currency
                ? `${interview.price} ${interview.currency}`
                : "Not specified"}
            </p>
          </div>
          )}
         

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Meeting Mode</h4>
            <p className="text-gray-800 font-medium flex items-center">
              {interview?.mode === "online" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              {interview?.mode === "inperson" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {interview?.mode === "phone" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
              {interview?.mode || "Not specified"}
            </p>
          </div>

         {/* Meeting Link: for "online" or "online/inperson" */}
{(interview?.mode === "online" || interview?.mode === "online/inperson") && (
  <div className="p-4 bg-gray-50 rounded-lg">
    <h4 className="text-sm font-medium text-gray-500 mb-2">Meeting Link</h4>
    <p className="text-gray-800 font-medium">{interview?.meeting_link || "Not specified"}</p>
  </div>
)}

{/* In-Person Mode: only for "inperson" */}
{interview?.mode === "inperson" && (
  <div className="p-4 bg-gray-50 rounded-lg">
    <h4 className="text-sm font-medium text-gray-500 mb-2">In-Person Mode</h4>
    <p className="text-gray-800 font-medium">
      {interview?.inperson_mode === "inhouse" ? "In House" : 
       interview?.inperson_mode === "athome" ? "At Home" : 
       "Not specified"}
    </p>
  </div>
)}

            {/* Location: 
              - For "inperson" + inhouse
              - OR for "online/inperson" (always)
            */}
          {(interview?.mode === "inperson" && interview?.inperson_mode === "inhouse" && interview?.location) ||
            interview?.mode === "online/inperson" && interview?.location ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                <p className="text-gray-800 font-medium">{interview.location}</p>
              </div>
            ) : null}

             <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Reminder Note</h4>
                <p className="text-gray-800 font-medium"> {interview?.reminder_note !== null ? interview.reminder_note :"Not specified" }</p>
              </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Allow Double Booking</h4>
            <p className="text-gray-800 font-medium">{interview?.double_book === true ? "Yes" : "No"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Require Appointment Approval</h4>
            <p className="text-gray-800 font-medium">{interview?.approve_appointment === true ? "Yes" : "No"}</p>
          </div>

          {interview?.type !== "resource" && interview?.type !== "collective-booking" && (
            
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Require Staff Selection</h4>
            <p className="text-gray-800 font-medium">{interview?.require_staff_select === true ? "Yes" : "No"}</p>
          </div>
          )}
        
        {interview?.type === "resource" &&  (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Require End Time</h4>
            <p className="text-gray-800 font-medium">{interview?.require_end_time === true ? "Yes" : "No"}</p>
          </div>
        )}
          

          {interview?.type === "group-booking" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Maximum Clients</h4>
              <p className="text-gray-800 font-medium">{interview?.max_clients == 0 ? "Unlimited" : interview?.max_clients || "Not specified"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailsShow;