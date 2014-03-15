<?php

class radio {
    public $name;
    public $id;

    public function __construct($nams, $is) {
        $this->name = $nams;
        $this->id = $is;
    }
}
class stream {
    public $id;
    public $url;
    public $name;

    public function __construct($nams, $is, $uri) {
        $this->name = $nams;
        $this->id = $is;
        $this->url = $uri;
    }
}
class alarm {
    public $id;
    public $time;
    public $stream;
    public $type;
    public $desc;

    public function __construct($tijs, $is, $steam, $typs, $desg) {
        $this->time = $tijs;
        $this->id = $is;
        $this->stream = $steam;
        $this->type = $typs;
        $this->desc = $desg;
    }
}
class jsonstruct {
    #public $radios;
    public $streams;
    public $alarms;

    public function __construct($stims, $almr) {
        #$this->radios = $rads;
        $this->streams = $stims;
        $this->alarms = $almr;
    }
}

$con=mysqli_connect("localhost","ipac_user","kissFM","ipac_user");


function getStreams($con)
{
    #parsing streams
    $result = mysqli_query($con,"SELECT * FROM streams43");
    $s = array();
    while($row = mysqli_fetch_array($result))
    {
        $s[] = new stream($row['NAME'], $row['ID'], $row['URL']);
    }
    return $s;
}

function getAlarms($con)
{
    #parsing alarms
    $result = mysqli_query($con,"SELECT * FROM alarm");
    $a = array();
    while($row = mysqli_fetch_array($result))
    {
        $a[] = new alarm($row['ALARM_TIME'], $row['RADIO_ID'], $row['STREAM'], $row['TYPE'], $row["DESCRIPTION"]);
    }

    return $a;
}

function getRadios($con)
{
    #parsing radios
    $result = mysqli_query($con,"SELECT * FROM radios");
    $r = array();
    while($row = mysqli_fetch_array($result))
    {
        $r[] = new radio($row['NAME'], $row['ID']);
    }
    return $r;
}

function addStream($url, $name, $con)
{
    $query = "INSERT INTO streams43 (URL, NAME) VALUES ('".$url."', '".$name."')";
    $result = mysqli_query($con,$query);
    return $result;
}

function checkId($id, $con)
{
    if ($id === "")
        return false;
    foreach (getRadios($con) as $i)
    {
        if ($i->id === $id)
            return true;
    }
    return false;
}

function getId($name, $con)
{
    if ($name === "")
        return -1;
    foreach (getRadios($con) as $i)
    {
        if ($i->name === $name)
        {
            return $i->id;
        }
    }
    return -1;
}

function isValidRadioName($name, $con)
{
    if ($name === "")
        return false;
    foreach (getRadios($con) as $i)
    {
        if ($i->name === $name)
        {
            return true;
        }
    }
    return false;
}

// Check connection
if (mysqli_connect_errno())
{
	//echo "Failed to connect to MySQL: " . mysqli_connect_error();
    echo "{\"Error\":\"MySql connection failed\"}";
}
else
{
    #$e = new jsonstruct($r, $s, $a);
    if ($_GET["q"]!=null)
    {
        switch ($_GET["q"]) {
            #case 'radio':
            #   echo json_encode(getRadios($con));
            #    break;
            
            case 'alarm':
                echo json_encode(getAlarms($con));
                break;

            case 'stream':
                echo json_encode(getStreams($con));
                break;

            case 'checkid':
                if (checkId($_GET['id'], $con))
                {
                    echo 1;
                }
                else
                    echo 0;
                break;

            case 'manual':
                echo "henk";
                break;

            case 'getid':
                if (isValidRadioName($_GET["name"], $con))
                {
                    echo "{\"result\":\"linked to id ".getId($_GET["name"], $con)."\"}";
                }
                else
                {
                    echo "{\"result\":\"no linked id\"}";
                }
                break;

            case 'validate':
                if (isValidRadioName($_GET["name"], $con))
                {
                    echo "{\"result\":\"name ".$_GET["name"]." is valid\"}";
                }
                else
                {
                    echo "{\"result\":\"name ".$_GET["name"]." is invalid\"}";
                }
                break;

            case 'addstream': 
                if ($_GET['name'] != "" && $_GET['url'] != "" && $_GET['id'] != "")
                {
                    if (checkId($_GET['id'], $con))
                    {
                        $s = addStream($_GET['url'], $_GET['name'], $con);
                        if ($s > 0)
                        {
                            echo "{\"result\":\"success\"}";
                        }
                        else
                            die($s."shit");
                    }
                    else
                       echo "{\"error\":\"Invalid ID\"}"; 
                }
                else
                    echo "{\"error\":\"Invalid parameters\"}";
                break;

            

            default:
                echo "{\"error\":\"Invalid query\"}";
                break;
        }
    }
    else
        echo json_encode(new jsonstruct(getStreams($con), getAlarms($con)));
}
?>