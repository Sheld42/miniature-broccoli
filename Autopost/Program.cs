using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using HardwareID;
namespace Autopost
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
           
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            DigitalSignature rsa = new DigitalSignature();
            if (rsa.Check_Only())
                Application.Run(new Welcome());
            else
                Application.Run(new License());
        }
    }
}
