import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { signup, signin, getUsers, checkAuthenticated } from '../../Store/AuthSlice';
import { useDispatch } from 'react-redux';
import { useState } from "react";
import FileBase from 'react-file-base64';

export default function SignUp() {


    const [isSignUp, setIsSignUp] = useState(true);
    const url = isSignUp ? "SignUp" : "LogIn";
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState("");
    // const [tagLine, setTagLine] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const dataObj = {
            name: data.get('firstName') + " " + data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
            tagLine: data.get('tagLine'),
            profileImage: selectedFile
        }
        console.log(selectedFile);
        if (isSignUp) {
            await dispatch(signup(dataObj));
            await dispatch(checkAuthenticated());
            await dispatch(getUsers());
        }
        else {
            await dispatch(signin(dataObj));
            await dispatch(checkAuthenticated());
            await dispatch(getUsers());
        }
    };
    return (



        <Container component="main" maxWidth="xs">
            {/* <CssBaseline /> */}
            <Box
                sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isSignUp ? "Sign Up" : "SignIn"}
                </Typography>
                <Box component="form" type noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {isSignUp && <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>}
                        {isSignUp && <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>

                        {isSignUp && <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="tagLine"
                                label="Enter your tagLine (optional)"
                                type="text"
                                id="tagLine"
                            />
                        </Grid>
                        }
                        {isSignUp &&
                            <Grid style={{ width: "100%", textAlign: "center", marginTop: "1rem", border: "1px solid lightgrey", padding: "0.8rem", marginLeft: "1rem", borderRadius: "5px" }} >
                                <FileBase
                                    name='file'
                                    type="file"
                                    multiple={false}
                                    onDone={({ base64 }) => setSelectedFile(base64)}
                                />
                            </Grid>
                        }
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 0, mb: 2 }}
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href={`/${url}`} variant="body2" onClick={(e) => {
                                e.preventDefault();
                                setIsSignUp(!isSignUp);
                            }}>
                                {isSignUp ? "Already have an account? Sign in" : "Not a user ,Register Here"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            {/* <Copyright sx={{ mt: 5 }} /> */}
        </Container>
    );
}