﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using HardwareID;
using MetroFramework.Components;
using MetroFramework.Forms;
namespace Autopost
{
    public partial class PostOndn : MetroForm
    {
        public PostOndn()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void License_Load(object sender, EventArgs e)
        {
            kek rsa = new kek();
            textBox1.Text = rsa.get_hash();
        }
    }
}
