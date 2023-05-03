const { LogInCollection, Owner, LandHolding } = require("../models/schemas");


exports.userlogin= async(req,res) => {
    console.log("hello?")
    const { email, password } = req.body;
    try {
        const user = await LogInCollection.findOne({ email: email });
    
        if (user && user.password === password) {
          console.log('login success');
          return res.status(200).json({ message: 'Login successful' });
        } else {
          console.log('incorrect password');
          return res.status(401).json({ message: 'Incorrect email or password' });
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
      }
    };

    exports.userReg = async (req, res) => {
        const { email, password } = req.body;
        try {
          const user = await LogInCollection.findOne({ email: email });
          if (user) {
            console.log('user with that email already exists');
            return res.status(409).json({ message: 'User with that email already exists' });
          } else {
            const newUser = new LogInCollection({ email: email, password: password });
            await newUser.save();
            console.log('registration success');
            return res.status(200).json({ message: 'Registration successful' });
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server Error' });
        }
      };

    exports.addOwner= async(req,res)=>{
        const ownerData = {
            name: req.body.name,
            entityType: req.body.entityType,
            ownerType: req.body.ownerType,
            address: req.body.address,
            totalNumberOfLandHoldings: req.body.totalNumberOfLandHoldings
          };
        
          try {
            const existingOwner = await Owner.findOne({ name: ownerData.name, address: ownerData.address });
            if (existingOwner) {
              res.status(409).send('Owner already exists');
            } else {
              await Owner.create(ownerData);
              res.status(200).send('Owner added successfully');
            }
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
          }
        };

        exports.getOwners= async(req,res)=>{
            try {
            const owners = await Owner.find({}, { _id: 0, name: 1, entityType: 1, ownerType: 1, address: 1, totalNumberOfLandHoldings: 1 });
              res.json(owners);
            } catch (err) {
              console.error(err);
              res.status(500).send('Internal server error');
            }
          };
          exports.delOwner= async(req,res)=>{
            const { name, address } = req.params;
    
            try {
              const deletedOwner = await Owner.findOneAndDelete({ name, address });
              
              if (!deletedOwner) {
                return res.status(404).json({ message: 'Owner not found' });
              }
              await LandHolding.deleteMany({ owner: deletedOwner.name });
              
              return res.status(200).json({ message: 'Owner deleted successfully' });
            } catch (error) {
              console.error(error);
              return res.status(500).json({ message: 'Server error' });
            }
          };

          exports.editOwner = async (req, res) => {
            try {
              const oldName = req.body.oldName;
              const oldAddress = req.body.oldAddress;
              const newName = req.body.name;
              const newAddress = req.body.address;
              const updatedOwner = {
                name: newName,
                entityType: req.body.entityType,
                ownerType: req.body.ownerType,
                address: newAddress,
                totalNumberOfLandHoldings: req.body.totalNumberOfLandHoldings,
              };
          
              const validationError = new Owner(updatedOwner).validateSync();
              if (validationError) {
                return res.status(400).json({ error: validationError.message });
              }
          
              const result = await Owner.findOneAndUpdate({ name: oldName, address: oldAddress }, updatedOwner, { new: true, runValidators: true });
          
              // update the associated landholdings with the new owner name and address
              await LandHolding.updateMany({ owner: oldName, address: oldAddress }, { $set: { owner: newName, address: newAddress } });
          
              res.json(result);
            } catch (err) {
              console.error(err);
              res.status(500).send('Internal server error');
            }
          };

          exports.addLand=async(req,res)=>{
            const landHoldingData = {
                name: req.body.name,
                owner: req.body.owner,
                legalEntity: req.body.legalEntity,
                netMineralAcres: req.body.netMineralAcres,
                mineralOwnerRoyalty: req.body.mineralOwnerRoyalty,
                sectionName: req.body.sectionName,
                titleSource: req.body.titleSource,
              };
            
              try {
                const existingOwner = await Owner.findOne({ name: landHoldingData.owner });
                if (!existingOwner) {
                  res.status(400).send('Owner does not exist');
                } else {
                  // increase the total number of land holdings for the owner by 1
                  //existingOwner.totalNumberOfLandHoldings += 1;
                  await existingOwner.save();
                  await LandHolding.create(landHoldingData);
                  res.status(200).send('Landholding added successfully');
                }
              } catch (err) {
                console.error(err);
                res.status(500).send('Internal server error');
              }
            };

            exports.getLand=async(req,res)=>{
                try {
                    const landholdings = await LandHolding.find({},{_id:0, name: 1, owner: 1, legalEntity: 1,netMineralAcres: 1,mineralOwnerRoyalty: 1,sectionName:1,titleSource: 1});
                    res.send(landholdings);
                  } catch (error) {
                    console.error(error);
                    res.status(500).send('Server Error');
                  }
                };

            exports.delLand= async(req,res)=>{
                try {
                    const name = req.params.name;
                    const result = await LandHolding.findOneAndDelete({ name });
                    if (result) {
                      res.json({ message: `Landholding ${name} deleted successfully` });
                    } else {
                      res.json({ message: `Landholding ${name} not found` });
                    }
                  } catch (err) {
                    console.error(err);
                    res.status(500).send('Internal server error');
                  }
                };
            
            
                exports.editLand= async(req,res)=>{
                    try {
                        const name = req.body.oldName;
                        const newName = req.body.name;
                    
                        // Check if owner with given name exists
                        const existingOwner = await Owner.findOne({ name: req.body.owner });
                        if (!existingOwner) {
                          return res.status(400).json({ message: 'Owner does not exist' });
                        }
                    
                        const updatedLandholding = {
                          name: newName,
                          owner: req.body.owner,
                          legalEntity: req.body.legalEntity,
                          netMineralAcres: req.body.netMineralAcres,
                          mineralOwnerRoyalty: req.body.mineralOwnerRoyalty,
                          sectionName: req.body.sectionName,
                          titleSource: req.body.titleSource,
                        };
                    
                        const result = await LandHolding.findOneAndUpdate({ name: name }, updatedLandholding, { new: true, runValidators: true });
                        res.json(result);
                      } catch (err) {
                        console.error(err);
                        res.status(500).send('Internal server error');
                      }
                    };
                 
                
                