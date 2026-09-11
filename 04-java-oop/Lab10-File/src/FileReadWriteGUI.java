import javax.swing.*;
import javax.swing.border.Border;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.*;
import java.io.FileReader;

public class FileReadWriteGUI {
    private Frame fr;
    private Panel mainPanel,titlePanel,southPanel,p1;
    private TextArea textArea;
    private Button readButton , writeButton;
    private FileDialog fileDialog;
    private String fileContent;
    private Label titleLabel,tempLabel;

    public FileReadWriteGUI() {
        fr = new Frame("File Read and Writer");
        fr.setLayout(new FlowLayout());

        mainPanel = new Panel();
        mainPanel.setLayout(new BorderLayout());

        titlePanel = new Panel();
        titlePanel.setLayout(new FlowLayout());
        titleLabel = new Label(" >> File << ");

        southPanel = new Panel();
        southPanel.setLayout(new FlowLayout());

        textArea = new TextArea(25,50);


        readButton = new Button("ReadFile");
        writeButton = new Button("WriteFile");

        southPanel.add(readButton);
        southPanel.add(writeButton);

        titlePanel.add(titleLabel);

        tempLabel = new Label();

        p1 = new Panel();
        mainPanel.add(southPanel,BorderLayout.SOUTH);
        mainPanel.add(textArea,BorderLayout.CENTER);
        mainPanel.add(titlePanel,BorderLayout.NORTH);
        fr.setResizable(false);
        fr.setLocationRelativeTo(null);
        fr.add(mainPanel);
        //fr.pack();
        fr.setSize(500,500);
        fr.setVisible(true);


        //event
        fr.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });

        readButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                readFile();
            }
        });

        writeButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                writeFile();
            }
        });


    }




    public void readFile(){
        fileDialog = new FileDialog(fr,"Select File to Read",FileDialog.LOAD);
        fileDialog.setVisible(true);
        String filePath = fileDialog.getDirectory() + fileDialog.getFile();
        char[] ary =  new char[200];
        if(filePath != null && !fileDialog.getFile().isEmpty()){
            try {

                Reader input = new FileReader(filePath);
                input.ready();
                input.read(ary);
                textArea.setText(String.valueOf(ary));
                input.close();

            }catch(Exception e){
                e.getStackTrace();
            }
        }

    }

    public void writeFile(){
        fileDialog = new FileDialog(fr,"Save File As",FileDialog.SAVE);
        fileDialog.setVisible(true);
        String filePath = fileDialog.getDirectory() + fileDialog.getFile();
        String data = textArea.getText();
        if(filePath != null && !fileDialog.getFile().isEmpty()){
            try{

                Writer output = new FileWriter(filePath);
                output.write(data);
                output.close();
                textArea.setText("File Written Successfully to : " + filePath);

            }catch (Exception e){
                e.getStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        FileReadWriteGUI rw = new FileReadWriteGUI();
    }
}
