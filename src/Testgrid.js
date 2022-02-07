//import * as React from 'react';
import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useLocalStorage } from '@rehooks/local-storage';

const columns = [
    {field:'id',headerName:'x',hide:true,field_type:'number'},
    {field:'full_name',headerName:'Full Name',field_type:'text',required_:true,minWidth: 150},
    {field:'preferred_name',headerName:'Preferred Name',field_type:'text',required_:true,minWidth: 150},
    {field:'phone1',headerName:'Phone 1',field_type:'number',required_:true,minWidth: 150},
    {field:'phone2',headerName:'Phone 2',field_type:'number',required_:false,minWidth: 150},
    {field:'email',headerName:'Email',field_type:'email',required_:true,minWidth: 200},
    {field:'gross_salary',headerName:'Gross Salary',field_type:'number',required_:false,minWidth: 200,hidden_form:true}
    
]

const Testgrid = () => {
  const formRef = React.useRef();

  const [masterData,setMasterData] = useState([])
  const [tableData, setTableData] = useState([])
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4,setOpen4] = useState(false);
  const [open5,setOpen5] = useState(false);

  const [jkk,setJkk] = useState(0);
  const [jp,setJp] = useState(0);
  const [jht,setJht] = useState(0);
  const [jkm,setJkm] = useState(0);

  const [jp2,setJp2] = useState(0);
  const [jht2,setJht2] = useState(0);
  
  const [selectedData,setSelectedData] = useState('')

  const [userdata] = useLocalStorage('u');
  const [userRole] = useLocalStorage('r');

  useEffect(() => {
    fetchData()
  }, [])

  const Search = (event) =>{
    let phrase = event.target.value
    let newData = masterData
    if(phrase!==''){
      newData = masterData.filter(x=>x.full_name==phrase||x.preferred_name==phrase||x.phone1==phrase||x.phone2==phrase||x.email==phrase)
    }
    setTableData(newData)
  }

  const SelectMe = (id) =>{
    setSelectedData(masterData.filter(x=>x.id==id))
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClickOpen2 = () => {
    setOpen2(true);
  }

  const handleClickOpen3 = () => {
    setOpen3(true);
  }

  const handleClickOpen4 = () => {
    setOpen4(true)
  }

  const handleClickOpen5 = () =>{
    countJKK()
    countJP()
    countJHT()
    countJKM()
    countJP2()
    countJHT2()
    setOpen5(true)
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClose2 = () => {
    setOpen2(false);
  }

  const handleClose3 = () => {
    setOpen3(false);
  }

  const handleClose4 = () => {
    setOpen4(false);
  }

  const handleClose5 = () => {
    setOpen5(false);
  }

  const handleDelete = async() => {
    await fetch('http://localhost:1234/delete', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id:selectedData[0].id})
    })
    .then(function(){
      fetchData()
      handleClose()
    })
  }

  const fetchData = async() =>{
    await fetch("http://localhost:1234/list_employee",{
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${userdata}`
      }
    })
      .then((data) => data.json())
      .then(function(data){
        setMasterData(data)
        setTableData(data)
      })
  }

  const sbtAddNewEmployee = async(e) =>{
    const isValid = e.target.checkValidity();
    e.preventDefault()
    if (!isValid) {
      e.target.reportValidity();
    } else {
      const formData = new FormData(e.currentTarget)

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      var data = JSON.stringify(object);

      await fetch("http://localhost:1234/add_employee",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      })
      .then((data_) => data_.json())
      .then(function(data_){
        fetchData()
      handleClose2()
      })
    }
  }

  const sbtEditEmployee = async(e) =>{
    const isValid = e.target.checkValidity();
    e.preventDefault()
    if (!isValid) {
      e.target.reportValidity();
    } else {
      const formData = new FormData(e.currentTarget)

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      var data = JSON.stringify(object);

      await fetch("http://localhost:1234/edit_employee/"+selectedData[0].id,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      })
      .then((data_) => data_.json())
      .then(function(data_){
        fetchData()
      handleClose3()
      })
    }
  }

  const sbtUpdateSalary = async (e)=>{
    const isValid = e.target.checkValidity();
    e.preventDefault()
    if (!isValid) {
      e.target.reportValidity();
    } else {
      const formData = new FormData(e.currentTarget)
      await fetch("http://localhost:1234/update_salary/"+selectedData[0].id,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({gross_salary:formData.get("gross_salary")})
      })
      .then((data_) => data_.json())
      .then(function(data_){
        fetchData()
      handleClose4()
      })
    }
  }

  const countJKK = () =>{
    let jkk = Math.ceil(selectedData[0].gross_salary * (0.24/100))
    setJkk(jkk)
  }

  const countJP = () =>{
    let jp = Math.ceil(selectedData[0].gross_salary * (1/100))
    setJp(jp)
  }

  const countJP2 = () =>{
    let jp2 = Math.ceil(selectedData[0].gross_salary * (2/100))
    setJp2(jp2)
  }

  const countJHT = ()=>{
    let jht = Math.ceil(selectedData[0].gross_salary * (2/100))
    setJht(jht)
  }

  const countJHT2 = ()=>{
    let jht2 = Math.ceil(selectedData[0].gross_salary * (3.7/100))
    setJht2(jht2)
  }

  const countJKM = ()=>{
    let jkm = Math.ceil(selectedData[0].gross_salary * (0.3/100))
    setJkm(jkm)
  }



  return (
    <div>
      <div>
        <div style={{width:'50%',float:'left'}}>
          {
            userRole !== "finance" &&
          <Button variant="outlined" onClick={handleClickOpen2} startIcon={<AddIcon />}>
            Add
          </Button>
          }
          &nbsp;
          {
            userRole !== "finance" &&
          <Button variant="outlined" onClick={handleClickOpen3} startIcon={<EditIcon />}>
            Edit
          </Button>
          }
          &nbsp;
          {
            userRole !== "finance" &&
          <Button variant="outlined" onClick={handleClickOpen} startIcon={<DeleteIcon />}>
            Delete
          </Button>
          }
          &nbsp;
          {
            userRole === "hrd" &&
          <Button variant="outlined" onClick={handleClickOpen4} startIcon={<PaidIcon />}>
            Update Salary
          </Button>
          }
          &nbsp;
          {
            userRole === "finance" &&
          <Button variant="outlined" onClick={handleClickOpen5} startIcon={<PaidIcon />}>
            View Salary Slip
          </Button>
          }
        </div>
        <div style={{width:'50%',float:'left',textAlign:'right'}}>
        <TextField id="standard-basic" label="Search" variant="standard" onChange={Search} />
        </div>
      </div>
      <div>
        &nbsp;
      </div>
      <div style={{ height: 400, width: '100%' }}>
        
        <DataGrid
        onSelectionModelChange={(id) => {
          SelectMe(id)
        }}
          rows={tableData}
          columns={columns}
          pageSize={12}
        />
      </div>


        {/*dialog delete*/}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Employee Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {selectedData?selectedData[0]?"Delete employee data with email "+selectedData[0].email+"?":'':'Please select a data!'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {selectedData && selectedData[0] &&
           <div>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={handleDelete} autoFocus>
                Yes
              </Button>
              </div>
              ||
              <Button onClick={handleClose}>Ok</Button>
          }
        </DialogActions>
      </Dialog>

      {/*dialog add*/}
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Add New Employee
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={sbtAddNewEmployee} noValidate sx={{ mt: 1 }}>
            
          {
            columns.map(function(x){
             if(!x.hide&&!x.hidden_form){
                return (
                  <TextField
                 required={x.required_}
            label={x.headerName}
            type={x.field_type}
            name={x.field}
            key={x.field}
            fullWidth
            variant="standard"
          />
                )
                }
            })
          }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
               Save
              </Button>
             
          </Box>
        </DialogContent>
      </Dialog>


      {/*dialog edit*/}
      <Dialog
        open={open3}
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Edit Employee Data
        </DialogTitle>
        <DialogContent>
         {selectedData && selectedData[0] &&
         
            <Box component="form" onSubmit={sbtEditEmployee} noValidate sx={{ mt: 1 }}>
            
          {
            columns.map(function(x){
             if(!x.hide&&!x.hidden_form){
                return (
                  <TextField
                 required={x.required_}
            label={x.headerName}
            type={x.field_type}
            name={x.field}
            key={x.field}
            fullWidth
            variant="standard"
            defaultValue={selectedData[0][x.field]}
          />
                )
                }
            })
          }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
               Save
              </Button>
             
          </Box>
          ||
          <Box>
          <DialogContentText >
            Please select a data to Edit!
          </DialogContentText>
          
          <DialogActions>
            <Button onClick={handleClose3}>Ok</Button>
          </DialogActions>
          </Box>
          }
        </DialogContent>
      </Dialog>

      {/*dialog update salary*/}
      <Dialog
        open={open4}
        onClose={handleClose4}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Update Salary
        </DialogTitle>
        <DialogContent>
         {selectedData && selectedData[0] &&
         
            <Box component="form" onSubmit={sbtUpdateSalary} noValidate sx={{ mt: 1 }}>
            
              <TextField
              required={true}
              label={"Gross Salary"}
              type={"number"}
              name={"gross_salary"}
              key={"gross_salary"}
              fullWidth
              variant="standard"
              defaultValue={selectedData[0].gross_salary||0}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
               Save
              </Button>
             
          </Box>
          ||
          <Box>
          <DialogContentText >
            Please select a data to Update!
          </DialogContentText>
          
          <DialogActions>
            <Button onClick={handleClose4}>Ok</Button>
          </DialogActions>
          </Box>
          }
        </DialogContent>
      </Dialog>


      {/*dialog view salary*/}
      <Dialog
        open={open5}
        onClose={handleClose5}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Salary Slip
        </DialogTitle>
        <DialogContent>
         {selectedData && selectedData[0] &&
         
            <Box sx={{ mt: 1 }}>
            Income:<br/>
              <TextField
              required={true}
              label={"Gross Salary"}
              type={"number"}
              name={"gross_salary"}
              key={"gross_salary"}
              fullWidth
              variant="standard"
              defaultValue={selectedData[0].gross_salary||0}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JKK"}
              type={"number"}
              name={"jkk"}
              key={"jkk2"}
              fullWidth
              variant="standard"
              defaultValue={jkk}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JP Company"}
              type={"number"}
              name={"jp2"}
              key={"jp2"}
              fullWidth
              variant="standard"
              defaultValue={jp2}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JHT Company"}
              type={"number"}
              name={"jht2"}
              key={"jht2"}
              fullWidth
              variant="standard"
              defaultValue={jht2}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JKM"}
              type={"number"}
              name={"jkm"}
              key={"jkm2"}
              fullWidth
              variant="standard"
              defaultValue={jkm}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/><br/>
              Deduction:
              <TextField
              required={true}
              label={"JKK"}
              type={"number"}
              name={"jkk"}
              key={"jkk"}
              fullWidth
              variant="standard"
              defaultValue={jkk}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JP"}
              type={"number"}
              name={"jp"}
              key={"jp"}
              fullWidth
              variant="standard"
              defaultValue={jp}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JHT"}
              type={"number"}
              name={"jht"}
              key={"jht"}
              fullWidth
              variant="standard"
              defaultValue={jht}
              InputProps={{
                readOnly: true,
              }}
              />
              <br/>
              <TextField
              required={true}
              label={"JKM"}
              type={"number"}
              name={"jkm"}
              key={"jkm"}
              fullWidth
              variant="standard"
              defaultValue={jkm}
              InputProps={{
                readOnly: true,
              }}
              />
              <DialogActions>
            <Button onClick={handleClose5}>Ok</Button>
          </DialogActions>
          </Box>
          ||
          <Box>
          <DialogContentText >
            Please select to view Salary Slip!
          </DialogContentText>
          
          <DialogActions>
            <Button onClick={handleClose5}>Ok</Button>
          </DialogActions>
          </Box>
          }
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Testgrid