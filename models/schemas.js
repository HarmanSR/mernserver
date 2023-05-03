const mongoose = require("mongoose");
const OwnerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ["Company", "Individual", "Investor", "Trust"],
      required: true,
    },
    ownerType: {
      type: String,
      enum: ["Competitor", "Seller", "Investor", "Professional"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalNumberOfLandHoldings: {
      type: Number,
      default: 0,
    },
  });
  
  OwnerSchema.index({ name: 1, address: 1 }, { unique: true });
  
  const LandHoldingSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      // default: function () {
      //     return `${this.section}-${this.legalEntity}`;
      },
    //   owner: {
    //     type: String,
    //     required: true,
    // },
    owner: {
      type:String,
      required: true,
    },
    legalEntity: {
      type: String,
      required: true,
    },
    netMineralAcres: {
      type: Number,
      required: true,
    },
    mineralOwnerRoyalty: {
      type: Number,
      required: true,
    },
  
    sectionName: {
      type: String,
      required: true,
      match: [/[0-9]{3}-[0-9]{3}[NS]-[0-9]{3}[EW]$/,],
    },
    titleSource: {
      type: String,
      enum: ["Class A", "Class B", "Class C", "Class D"],
      required: true,
    },
  });
  // LandHoldingSchema.pre('save', function (next) {
  //   if (!this.name) {
  //     const sectionPrefix = this.sectionName.slice(0, 3); // get first 3 characters of section name
  //     this.name = `${sectionPrefix}-${this.legalEntity}`;
  //   }
  //   next();
  // });
  OwnerSchema.pre('findOneAndDelete', async function(next) {
    try {
      const owner = this.getQuery();
      const landHoldings = await LandHolding.find({ owner: owner.name });
      if (landHoldings.length > 0) {
        await LandHolding.deleteMany({ owner: owner._id });
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  
  
  const logInSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },{collection:"LogInCollection"});
  // Define Owner model
  const Owner = mongoose.model("Owner", OwnerSchema);
  
  // Define Land Holding model
  const LandHolding = mongoose.model("LandHolding", LandHoldingSchema);
  
  const LogInCollection=mongoose.model("LogInCollection", logInSchema)
  
  module.exports = {
    LogInCollection,
    Owner,
    LandHolding,
  };
  