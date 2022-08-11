const User = require("../models/User");

 const handleSubscription = async(id,subscription_status)=>{
  console.log(id,subscription_status,"helpers")
	try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: subscription_status,
        },
        { new: true }
      );
      console.log("updatedUser",updatedUser)
      // res.status(200).json(updatedUser);
    } catch (err) {
		console.log(err)    
	}
}
module.exports = handleSubscription;