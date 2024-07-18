exports.getUserController = (req, res) => {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  };
  
  exports.addTourController = (req, res) => {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  };
  
  exports.getTourController = (req, res) => {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  };
  
  exports.updateTourController = (req, res) => {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  };
  
  exports.deleteTourController = (req, res) => {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  };
  