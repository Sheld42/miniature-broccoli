using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using HardwareID;
using System.Diagnostics;
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
            kek rt = new kek();
            try
            {
                int a = 5 * 5492;
                MessageBox.Show((a / (2620 - 1310 * 2)).ToString());
            }
            catch
            {
                Stopwatch time = new Stopwatch();
                time.Reset();
                time.Start();
                if (rt.regmem())
                {
                    time.Stop();
                    if (5000 < time.ElapsedMilliseconds)
                     Application.Run(new License()); 
                    else
                        Application.Run(new Welcome());
                }
                else
                    Application.Run(new License());
            }
        }
    }
}
