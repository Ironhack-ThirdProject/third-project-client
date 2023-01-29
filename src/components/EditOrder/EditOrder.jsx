import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IsCustomer from "../IsCustomer/IsCustomer";

export function EditOrder({
  order,
  getOrderDetails,
  isSubmitted,
  setIsSubmitted,
}) {
  const [firstName, setFirstName] = useState(order.firstName);
  const [lastName, setLastName] = useState(order.lastName);
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress);
  const [billingAddress, setBillingAddress] = useState(order.billingAddress);
  const [showForm, setShowForm] = useState(false);

  const storedToken = localStorage.getItem("authToken");

  const navigate = useNavigate();

  const handleOrderDetails = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const requestBody = {
      firstName,
      lastName,
      shippingAddress,
      billingAddress,
    };

    axios
      .put(`${process.env.REACT_APP_SERVER_URL}/order`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log("checking new details?", response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleConfirmClick = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/order`,
        { status: true },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then((response) => {
        // TODO display a message to thank the user for the order
        navigate("/plants");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getOrderDetails();
  }, [isSubmitted]);

  return (
    <IsCustomer>
      <div>
        {order.firstName ||
        order.lastName ||
        order.billingAddress ||
        order.shippingAddress ? (
          <div>
            <div>
              <h3>Your Details:</h3>
              <p>
                <b>First Name:</b> {order.firstName}
              </p>
              <p>
                <b>Last Name:</b> {order.lastName}
              </p>
              <p>
                <b>Billing Address:</b> {order.billingAddress}
              </p>
              <p>
                <b>Shipping Address:</b> {order.shippingAddress}
              </p>
            </div>
            <div>
              <h3>Place an order:</h3>
              <p>Order status: {order.status ? "Confirmed" : "Pending"}</p>
            </div>

            {!order.status && (
              <div>
                <br /> <br />
                <Button onClick={handleConfirmClick}>Confirmation</Button>
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Edit Details" : "Hide Form"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3>Your Details:</h3>

            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Edit Details" : "Hide Form"}
            </Button>
          </div>
        )}

        {showForm ||
          (!order.status && (
            <form onSubmit={handleOrderDetails}>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <label>Billing Address:</label>
              <input
                type="text"
                name="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />

              <label>Shipping Address:</label>
              <input
                type="text"
                name="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />

              <button type="submit">Edit</button>
            </form>
          ))}
      </div>
    </IsCustomer>
  );
}
