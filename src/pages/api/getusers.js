import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";

export default async function getAllUsers(req,res) {
 try {
    dbConnect();

    if( req.method === 'Get'){
            const ticketDeatils = await Ticket.find({});

            if( !ticketDeatils){
                return res.status(401).json({
                    sucess  : false,
                    message : "Theri is no ticketDetails yet "
                })
            }

            return res.status(200).json({
                success : true,
                userinfo : ticketDeatils 
            })
    }

 } catch (error) {
        return res.status(500).json({
            sucess : false,
            message : "Error whilt geting the user info "
        })
 }  
}