import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from '@mui/material';

const paperProps = {
    style: {
        borderRadius: '6px', // Set the border radius to 6px
    },
};

const DetailsView = ({ open, product, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={paperProps}>
            <DialogTitle sx={{ backgroundColor: '#283047', color: 'white', borderRadius: '5px 5px 0px 0' }}>
                Product Details
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: 'f5f5f5' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Product ID:</Typography>
                                </TableCell>
                                <TableCell  >{product._id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Images:</Typography>
                                </TableCell>
                                <TableCell>    {product.imgSource && product.imgSource.map((image, index) => (
                                    <img key={index} src={image.url}
                                        alt={`${product.name} ${index}`} style={{ width: '100px', height: '100px', marginBottom: '1rem' }} loading='lazy' />
                                ))}


                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Brand:</Typography>
                                </TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Name:</Typography>
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Price:</Typography>
                                </TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Specs:</Typography>
                                </TableCell>
                                <TableCell>{product.specs}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Category:</Typography>
                                </TableCell>
                                <TableCell>{product.category.join(', ')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                                </TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Flavor:</Typography>
                                </TableCell>
                                <TableCell>{product.flavor}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Strength:</Typography>
                                </TableCell>
                                <TableCell>{product.strength}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Featured:</Typography>
                                </TableCell>
                                <TableCell>{product.isFeatured ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>SEO Title:</Typography>
                                </TableCell>
                                <TableCell>{product.seo.title}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>SEO Description:</Typography>
                                </TableCell>
                                <TableCell>{product.seo.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>SEO Keywords:</Typography>
                                </TableCell>
                                <TableCell>{product.seoKeywords.join(', ')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Shipping Weight:</Typography>
                                </TableCell>
                                <TableCell>{product.shipping.weight} oz</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Shipping Height:</Typography>
                                </TableCell>
                                <TableCell>{product.shipping.dimensions.height} in</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Shipping Width:</Typography>
                                </TableCell>
                                <TableCell>{product.shipping.dimensions.width} in</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Shipping Length:</Typography>
                                </TableCell>
                                <TableCell>{product.shipping.dimensions.length} in</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Date Added:</Typography>
                                </TableCell>
                                <TableCell>{new Date(product.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                            {/* Add more rows for additional fields as needed */}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <Box sx={{}}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="primary"
                    sx={{ m: 2, marginLeft: 'auto', display: 'flex' }}
                >
                    Close
                </Button>
            </Box>
        </Dialog>
    );
};

export default DetailsView;
