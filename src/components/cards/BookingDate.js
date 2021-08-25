import { Container, Col, Row, Button, Form } from 'react-bootstrap'
import moment from 'moment'
import React from 'react'
import { createBooking, getSingleStudio } from '../../lib/api'
import { useParams } from 'react-router'
import { Redirect } from 'react-router-dom'

const initialState = {
  bookedFrom: '',
  bookedTo: '',
}


function BookingDate() {
  const { studioId } = useParams()
  const [formData, setFormData] = React.useState(initialState)
  const [state, setState] = React.useState(false)
  const [theId, setTheId] = React.useState('')

  const [dummyFrom, setDummyFrom] = React.useState('')
  const [dummyTo, setDummyTo] = React.useState('')
  const [test, setTest] = React.useState(null)


  const handleFromChange = e => {
    setDummyFrom(e.target.value)
    setFormData({ ...formData, [e.target.name]: moment(e.target.value).format('DD-MM-YYYY') })
  }

  const handleToChange = e => {
    setDummyTo(e.target.value)
    setFormData({ ...formData, [e.target.name]: moment(e.target.value).format('DD-MM-YYYY') })
  }


  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const bookingRes = await createBooking(studioId, formData)
      const studioRes = await getSingleStudio(studioId)
      setTest(studioRes.data)
      setTheId(bookingRes.data._id)
      setState(true)
    } catch (err) {
      console.log(err.response)
    }
  }

  const today = moment(Date()).format('YYYY-MM-DD')

  return (
    <>
      {/* {console.log(moment(Date()).format('YYYY-MM-DD'))} */}
      <div>
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Col>
                <label htmlFor="from">From:</label>
                <input
                  aria-placeholder="From"
                  type="date"
                  id="bookedFrom"
                  name="bookedFrom"
                  onChange={handleFromChange}
                  value={dummyFrom}
                  min={today}
                  max="2023-12-31" />
              </Col>
              <Col>
                <label htmlFor="to">To:</label>
                <input
                  type="date"
                  id="bookedTo"
                  name="bookedTo"
                  onChange={handleToChange}
                  value={dummyTo}
                  min={today}
                  max="2023-12-31" />
              </Col>
              <Col>
                <Button variant="info" type="submit">Book</Button>
              </Col>
            </Row>
          </Container >
        </Form>
        {
          state &&
          <Redirect
            push
            to={{
              pathname: `/studios/${studioId}/bookings/${theId}`,
              state: {
                studios: { test },
              },
            }}
          ></Redirect>
        }
      </div >
    </>
  )
}

export default BookingDate