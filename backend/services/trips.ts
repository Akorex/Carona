import { sendEmail } from "../utils/mailer"


export const successfulCaronaGoTrip = async (firstName: string, email: string) => {

    const emailOptions = {
        from: "akoredeadewole8@gmail.com", // will be changed to Carona's
        to: email,
            subject: "Your Trip has successfully been created!", 
            body: `<h3> Thank you for riding with us, 
                    ${firstName} </h3>
                    
                   <p> Your seat has been reserved on the Carona Go vehicle
                   for you. Please arrive at the bus-station at or before the departure 
                   time as the vehicle will leave for the journey not long afterwards.</p>

                   <p> We hope you do have a smooth and convenient ride to your destination.
                    Thank you for riding with us. </p>

                    <p> Cheers, </p>
                    <p> Akorede from Carona. </p>
                    `
    }

    await sendEmail(emailOptions)
}