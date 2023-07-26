import { NgModule } from '@angular/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

@NgModule({
  exports: [
    ThemeProvider,
  ],
})
export class MaterialUiModule {
  constructor() {
    // Create a Material-UI theme if you want to customize the default theme
    // const theme = createMuiTheme({
    //   palette: {
    //     primary: {
    //       main: '#007bff',
    //     },
    //     secondary: {
    //       main: '#6c757d',
    //     },
    //   },
    // });

    // Or you can use the default theme without customizing
    const theme = createMuiTheme();

    // Apply the created or default theme
    (ThemeProvider as any).forRoot({ theme }); // Add type assertion here
  }
}
