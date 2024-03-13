import React, { useState } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaMinus } from "react-icons/fa";


const OPTIONS = [
    {
        Label: "First Name",
        Value: "first_name"
    }, {
        Label: "Last Name",
        Value: "last_name"
    }, {
        Label: "Gender",
        Value: "gender"
    }, {
        Label: "Age",
        Value: "age"
    }, {
        Label: "Account Name",
        Value: "account_name"
    }, {
        Label: "City",
        Value: "city"
    }, {
        Label: "State",
        Value: "state"
    }
]

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [segment_name, set_segment_name] = useState("");
  const [Add_schema_to_segment, set_Add_schema_to_segment] = useState("");
  const [ Added_schema, setAdded_schema ] = useState([])


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setAdded_schema([])
    set_Add_schema_to_segment("")
  };

  const AddNewSchema = () => {
    if(Add_schema_to_segment){
        const updatedArray = [...Added_schema, Add_schema_to_segment];
        setAdded_schema(updatedArray);
        set_Add_schema_to_segment("")
    }
  }

  const removeAddedSchema = (index) => {
    const newArray = [...Added_schema];
    newArray.splice(index, 1);
    setAdded_schema(newArray);
    set_Add_schema_to_segment("")
  }

  const modifyAddedSchema = (val, index) => {
    const newArray = [...Added_schema];
    newArray[index] = val;
    setAdded_schema(newArray);
    set_Add_schema_to_segment("")
  };


  const onSave = async () => {

    let FINAL_DATA = {
        "segment_name": segment_name,
        "schema": []
    }

    // coverting array of object into plain object
    const OBJ = {};
    OPTIONS.forEach(item => {
        OBJ[item.Value] = item.Label;
    });

    FINAL_DATA.schema = Added_schema.map( each => {
        return { [each] : OBJ[each] }
    })

    console.log(FINAL_DATA)

    // getting CORS error while sending data to webhook URL, so here am send data to node server from there am sending data to webhook URL.
    const webhookUrl = 'http://localhost:3001/sendData';

    try {
      const response = await axios.post(webhookUrl, FINAL_DATA);
      console.log('Data sent successfully:', response.data);
      toggleMenu()
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
  



  return (

    <div className={`app ${isMenuOpen ? 'w-1/2 transition-transform' : 'transition-transform'}`}>
        <button className="mt-9 md:p-3 text-lg cursor-pointer font-bold rounded border-2 border-solid border-black" onClick={toggleMenu}>
            Save segment
        </button>
        <div className={`${isMenuOpen ? 'right-0' : 'right-full'} fixed top-0 h-full w-3/2 bg-gray-100 transition-transform ease-in-out duration-300 overflow-y-auto`}>
            <div className="text-left font-bold text-white text-lg bg-teal-500 p-6 flex items-center">
            <FaChevronLeft className="mr-3 font-extrabold" />
            <p>Saving Segment</p>
            </div>
            <div className="flex flex-col h-full m-10">

                <div className="mb-3 text-left">Enter the Name of the Segment</div>

                <input
                    className="border p-2 mb-6 rounded"
                    placeholder='Name of the segment'
                    type='text'
                    value={segment_name}
                    onChange={e => set_segment_name(e.target.value)}
                />

                <div className="mb-8 text-left">To save your segment, you need to add the schemas to build the query</div>

                {Added_schema.length >= 1 && (
                    <div className="mx-auto mb-2 p-2 border-2 border-blue-500">
                    {Added_schema.map((each, indx) => (
                        <div className="flex m-4 mx-auto" key={indx}>
                            <select
                                value={each}
                                onChange={e => modifyAddedSchema(e.target.value, indx)}
                                className="border p-2 mr-2 rounded w-80"
                            >
                                {OPTIONS.map((opt, i) => (
                                (each === opt.Value || !Added_schema.includes(opt.Value)) ? (
                                    <option key={i} value={opt.Value}>{opt.Label}</option>
                                ) : null
                                ))}
                            </select>
                            <button className="border p-2 font-extrabold bg-teal-50" onClick={() => removeAddedSchema(indx)}><FaMinus /></button>
                        </div>
                    ))}
                    </div>
                )}

                <div className="flex mb-1 mx-auto">
                    <select
                    value={Add_schema_to_segment}
                    onChange={e => set_Add_schema_to_segment(e.target.value)}
                    className="border p-2 mr-2 rounded w-80"
                    >
                    <option>Add schema to segment</option>
                        {OPTIONS.map((opt, i) =>
                            (!Added_schema.includes(opt.Value)) ? (
                            <option key={i} value={opt.Value}>{opt.Label}</option>
                            ) : null
                        )}
                    </select>
                    <button className="border p-2 font-extrabold bg-teal-50" onClick={() => set_Add_schema_to_segment("")}><FaMinus /></button>
                </div>

                <div className="flex mb-4 ml-20"> 
                    <button className="font-medium border-b-2 border-teal-500 text-sm text-teal-500 py-2 px-0" onClick={AddNewSchema}>+ Add new schema</button>
                </div>


                <div className="flex fixed bottom-0 my-8">
                    <button className="rounded font-medium bg-teal-500 text-white py-2 px-4 mr-4" onClick={onSave}>Save the Segment</button>
                    <button className="rounded font-medium bg-white text-red-600 py-2 px-4" onClick={toggleMenu}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
    
  );
};

export default App;
