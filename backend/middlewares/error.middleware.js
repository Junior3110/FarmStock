const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    res.status(err.status || 500).json({
        success: false,
        data: null,
        message: err.message || "Error interno del servidor"
    });
};

module.exports = errorHandler;
