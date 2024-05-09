import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          <IconButton sx={{ margin: "auto" }}>
            <DescriptionIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
          STEP File Analyzer
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
